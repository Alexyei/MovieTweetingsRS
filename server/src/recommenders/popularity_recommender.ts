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
                movieId: movieId
            },
            orderBy: {
                rating: 'desc',
            },
        })

        return {userId,movieId, rating:avgRating._avg.rating}
    }

    async recommendItems(userId: number, take: number = 10) {
        const popItems = await prisma.rating.groupBy({

            by: ['movieId'],
            where: {
                NOT: {
                    authorId: userId,
                },
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

    // async recommendBestSellers(userId: number, take: number = 10) {
    //     items = Log.objects.values('content_id')
    //     items = items.filter(event='buy').annotate(Count('user_id'))
    //
    //     const popItems = await prisma.userEvent.groupBy({
    //
    //         by: ['movieId'],
    //         where: {
    //             NOT: {
    //                 userId: userId,
    //             },
    //         },
    //
    //         _avg: {
    //             rating: true,
    //         },
    //         _count: {
    //             userId: true,
    //         },
    //         orderBy: [
    //             {
    //                 _count: {
    //                     userId: 'desc',
    //
    //                 },
    //             },
    //             {
    //                 _avg: {
    //                     rating: 'desc',
    //                 },
    //             }
    //         ],
    //
    //         take: take,
    //     })
    // }
}