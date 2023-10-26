import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";

class MovieGetDAO__mixin extends DAOMixinHelper {
    async getFullMoviesDataByIds(movieIds: string[]){
        const averageRatings = await this.getMoviesAverageRatingByIds(movieIds)
        const movieData = await this.getMoviesDataWithGenresByIds(movieIds)

        return movieData.map((movieData)=>({...movieData,mean_rating: averageRatings.find((ar)=>ar.movieId == movieData.id)!._avg.rating || 0}))
    }

    async getMoviesAverageRatingByIds(movieIds: string[]){
        if (this._testDb) {
            return this._client.testRating.groupBy({
                  by: ['movieId'],
                  where: { type: 'EXPLICIT', 'movieId': {in: movieIds}, },
                  _avg: {
                    rating: true
                  }
                });
        }
        return this._client.rating.groupBy({
            by: ['movieId'],
            where: { type: 'EXPLICIT', 'movieId': {in: movieIds}, },
            _avg: {
                rating: true
            }
        });
    }

    async getMoviesDataWithGenresByIds(movieIds: string[]){
        if (this._testDb) {
            return this._client.testMovie.findMany({
                where: {id: {in: movieIds},},
                select: {
                    id: true,
                    poster_path: true,
                    title: true,
                    description: true,
                    year: true,
                    genres: {
                        select: {
                            id:true,
                            name: true
                        }
                    }
                },
            });
        }
        return this._client.movie.findMany({
            where: {id: {in: movieIds},},
            select: {
                id: true,
                poster_path: true,
                title: true,
                description: true,
                year: true,
                genres: {
                    select: {
                        id:true,
                        name: true
                    }
                }
            },
        });
    }

    // async getMoviesDataByIds(movieIds: string[]) {
    //     if (this._testDb) {
    //         return this._client.testMovie.findMany({
    //             where: {id: {in: movieIds},},
    //             select: {
    //                 id: true,
    //                 poster_path: true,
    //                 title: true,
    //             },
    //         });
    //     }
    //     return this._client.movie.findMany({
    //         where: {id: {in: movieIds},},
    //         select: {
    //             id: true,
    //             poster_path: true,
    //             title: true,
    //         },
    //     });
    // }
}


export function createMovieGetDAOMixin(client: PrismaClient, testDb: boolean) {
    const mixin = new MovieGetDAO__mixin(client, testDb)

    return {
        // 'getMoviesDataByIds': mixin.getMoviesDataByIds.bind(mixin),
        'getFullMoviesDataByIds': mixin.getFullMoviesDataByIds.bind(mixin)
    }
}