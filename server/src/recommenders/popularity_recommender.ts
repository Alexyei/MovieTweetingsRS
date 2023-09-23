import {BaseRecommender} from "./base_recommender";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export class PopularityRecommender extends BaseRecommender {
    async predictScore(userId: number, movieId: string) {
        const avgRating = await prisma.rating.aggregate({
            _avg: {
                rating: true,
            },
            where: {
                NOT: {
                    authorId: userId,
                },
                movieId: movieId,
                type:  'EXPLICIT'
            },
            orderBy: {
                rating: 'desc',
            },
        })

        return {userId,movieId, rating:avgRating._avg.rating}
    }
    //recommend_items_by_ratings
    async predictScoreForMovies(moviesIds:string[],take=10){
        const popItems = await prisma.rating.groupBy({

            by: ['movieId'],
            where: {
                movieId: {in: moviesIds},
                type: "EXPLICIT"
            },

            _avg: {
                rating: true,
            },
            _count: {
                authorId: true,
            },
            orderBy: [
                {
                    _count: {
                        authorId: 'desc',

                    },
                },
                {
                    _avg: {
                        rating: 'desc',
                    },
                }
            ],

            take: take,
        })

        return popItems.map(m=>{
            return {
                movieId:m.movieId,
                ratingCount: m._count.authorId,
                avgRating: m._avg.rating
            }
        })
    }
    async recommendItems(userId: number, take: number = 10) {
        const popItems = await prisma.rating.groupBy({

            by: ['movieId'],
            where: {
                NOT: {
                    authorId: userId,
                },
                type: "EXPLICIT"
            },

            _avg: {
                rating: true,
            },
            _count: {
                authorId: true,
            },
            orderBy: [
                {
                    _count: {
                        authorId: 'desc',

                    },
                },
                {
                    _avg: {
                        rating: 'desc',
                    },
                }
            ],

            take: take,
        })

        const movieIds =popItems.map((item) =>item.movieId)
        const moviesData = await prisma.movie.findMany({
            where: {
                id: {
                    in: movieIds,
                },

            },
            select: { id: true, poster_path: true },
        });


        return popItems.map(movie=>{
            const movieData = moviesData.find(m=>m.id == movie.movieId)!
            return {
                movieId: movieData.id,
                poster_path: movieData.poster_path,
                ratingsCount: movie._count.authorId,
                avgRating: movie._avg.rating
            }
        })
    }
    //recommend_items_from_log
    async recommendBestSellers(userId: number, take: number = 10) {
        const popItems = await prisma.userEvent.groupBy({
            by: ['movieId'],
            where: {
                NOT: {
                    userId: userId,
                },
                event: 'BUY'
            },
            _count: {
                userId: true,
            },
            orderBy: [
                {
                    _count: {
                        userId: 'desc',

                    },
                },
            ],

            take: take,
        })
        const moviesIds = popItems.map(m=>m.movieId) as string[]

        const predictedScore = await this.predictScoreForMovies(moviesIds,take)

        const moviesData = await prisma.movie.findMany({
            where: {
                id: {
                    in: moviesIds,
                },

            },
            select: { id: true, poster_path: true },
        });

        return popItems.map(m=>{
            const score = predictedScore.find(movie=>m.movieId==movie.movieId)!
            const data = moviesData.find(movie=>m.movieId==movie.id)!

            return {
                purchases: m._count.userId,
                poster_path: data.poster_path,
                ...score
            }
        }).sort((a,b) => {
            if (a.purchases < b.purchases) {
                return 1;
            }
            if (a.purchases > b.purchases) {
                return -1;
            }

            // Если значения "name" одинаковы, сравниваем поле "age"
            if (a.avgRating! < b.avgRating!) {
                return 1;
            }
            if (a.avgRating! > b.avgRating!) {
                return -1;
            }


            return 0;
        })
    }

}