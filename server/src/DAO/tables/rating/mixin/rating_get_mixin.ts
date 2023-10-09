import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";

class ExplicitRatingGetDAO__mixin extends DAOMixinHelper {
    async getAvgAndCountMoviesForUser(userId: number, take: number) {
        let movies = []
        if (this._testDb) {
            movies = await this._client.testRating.groupBy({

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
        }
        else {
            movies =await this._client.rating.groupBy({

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
        }

        return movies.map(m => {
            return {
                movieId: m.movieId,
                count: m._count.authorId,
                avg: m._avg.rating
            }
        })
    }

    async getAvgAndCountByMovieIds(movieIds: string[], take: number) {
        let movies = []
        if (this._testDb) {
            movies = await this._client.testRating.groupBy({

                by: ['movieId'],
                where: {
                    movieId: {in: movieIds},
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
        } else {
            movies = await this._client.rating.groupBy({

                by: ['movieId'],
                where: {
                    movieId: {in: movieIds},
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
        }


        return movies.map(m => {
            return {
                movieId: m.movieId,
                count: m._count.authorId,
                avg: m._avg.rating
            }
        })
    }

    async getAvgRatings() {
        let ratings = []
        if (this._testDb)
            ratings = await this._client.testRating.groupBy({
                by: 'authorId',
                _avg: {rating: true},
                where: {type: 'EXPLICIT'},
                orderBy: {authorId: 'asc'}
            })
        else
            ratings = await this._client.rating.groupBy({
                by: 'authorId',
                _avg: {rating: true},
                where: {type: 'EXPLICIT'},
                orderBy: {authorId: 'asc'}
            })

        return ratings.map((r) => ({authorId: r.authorId, _avg: r._avg.rating!}))
    }

    async getAvgRatingForUser(userId: number, movieId: string) {
        let avgRating = undefined
        if (this._testDb)
            avgRating = await this._client.testRating.aggregate({
                _avg: {rating: true,},
                where: {NOT: {authorId: userId,}, movieId: movieId, type: 'EXPLICIT'},
            })
        else
            avgRating = await this._client.testRating.aggregate({
                _avg: {rating: true,},
                where: {NOT: {authorId: userId,}, movieId: movieId, type: 'EXPLICIT'},
            })

        return {userId, movieId, rating: avgRating._avg.rating}
    }

    async count() {
        return this._testDb ? this._client.testRating.count({where: {type: 'EXPLICIT'}}) : this._client.rating.count({where: {type: 'EXPLICIT'}});
    }

    async all() {
        return this._testDb ? this._client.testRating.findMany({where: {type: 'EXPLICIT'}}) : this._client.rating.findMany({where: {type: 'EXPLICIT'}});
    }

    async getUniqueMovieIds() {
        let uniqueMovieIds = []
        if (this._testDb)
            uniqueMovieIds = await this._client.testRating.findMany({
                where: {type: 'EXPLICIT'},
                distinct: ['movieId'],
                orderBy: {movieId: 'asc',},
                select: {movieId: true},
            })
        else
            uniqueMovieIds = await this._client.rating.findMany({
                where: {type: 'EXPLICIT'},
                distinct: ['movieId'],
                orderBy: {movieId: 'asc',},
                select: {movieId: true},
            })
        return uniqueMovieIds.map(mid => mid.movieId);
    }

    async getUniqueUserIds() {
        let uniqueUserIds = []
        if (this._testDb)
            uniqueUserIds = await this._client.testRating.findMany({
                where: {type: 'EXPLICIT'},
                distinct: ['authorId'],
                orderBy: {authorId: 'asc',},
                select: {authorId: true},
            })
        else
            uniqueUserIds = await this._client.rating.findMany({
                where: {type: 'EXPLICIT'},
                distinct: ['authorId'],
                orderBy: {authorId: 'asc',},
                select: {authorId: true},
            })
        return uniqueUserIds.map(uid => uid.authorId);
    }

    async getByMovieIds(movieIds: string[]) {
        return this._testDb ? this._client.testRating.findMany({
            where: {
                movieId: {in: movieIds},
                type: 'EXPLICIT'
            }
        }) : this._client.rating.findMany({where: {movieId: {in: movieIds}, type: 'EXPLICIT'}})
    }

    async getByUserIds(userIds: number[]) {
        return this._testDb ? this._client.testRating.findMany({
            where: {
                authorId: {in: userIds},
                type: 'EXPLICIT'
            }
        }) : this._client.rating.findMany({where: {authorId: {in: userIds}, type: 'EXPLICIT'}})
    }

    async getByUserId(userId: number) {
        return this._testDb ? this._client.testRating.findMany({
            where: {
                authorId: userId,
                type: 'EXPLICIT'
            }
        }) : this._client.rating.findMany({where: {authorId: userId, type: 'EXPLICIT'}})
    }
}


export function createExplicitRatingGetDAOMixin(client: PrismaClient, testDb: boolean) {
    const mixin = new ExplicitRatingGetDAO__mixin(client, testDb)

    return {
        'getAvgRatings': mixin.getAvgRatings.bind(mixin),
        'getAvgRatingForUser': mixin.getAvgRatingForUser.bind(mixin),
        'getAvgAndCountMoviesForUser': mixin.getAvgAndCountMoviesForUser.bind(mixin),
        'getAvgAndCountByMovieIds': mixin.getAvgAndCountByMovieIds.bind(mixin),
        'all': mixin.all.bind(mixin),
        'count': mixin.count.bind(mixin),
        'getUniqueMovieIds': mixin.getUniqueMovieIds.bind(mixin),
        'getUniqueUserIds': mixin.getUniqueUserIds.bind(mixin),
        'getByMovieIds': mixin.getByMovieIds.bind(mixin),
        'getByUserIds': mixin.getByUserIds.bind(mixin),
        'getByUserId': mixin.getByUserId.bind(mixin),
    }
}