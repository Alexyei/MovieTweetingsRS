import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {MovieOrderingT} from "../../../../types/movie.types";

class MovieGetDAO__mixin extends DAOMixinHelper {

    async searchMovies(searchRequest: string, yearFrom: number, yearTo: number, genresIDs: number[], ordering: MovieOrderingT, take: number, skip: number) {

        function getOrdering(ordering: MovieOrderingT) {
            switch (ordering) {
                case "title asc":
                    return {title: 'asc' as 'asc'}
                case "title desc":
                    return {title: 'desc' as 'desc'}
                case "year asc":
                    return {year: 'asc' as 'asc'}
                case "year desc":
                    return {year: 'desc' as 'desc'}
            }
        }


        const movieIDs = this._testDb ? await this._client.testMovie.findMany({
                where:
                    {
                        OR: [
                            {title: {contains: searchRequest, mode: 'insensitive'},},
                            {description: {contains: searchRequest, mode: 'insensitive'},},
                        ],
                        year: {gte: yearFrom, lte: yearTo},
                        genres: {some: {id: genresIDs.length > 0 ? {in: genresIDs} : undefined}}
                    },
                orderBy: getOrdering(ordering),
                select: {
                    id: true
                },
                skip,
                take
            })
            :
            await this._client.movie.findMany({
                where:
                    {
                        OR: [
                            {title: {contains: searchRequest, mode: 'insensitive'},},
                            {description: {contains: searchRequest, mode: 'insensitive'},},
                        ],
                        year: {gte: yearFrom, lte: yearTo},
                        genres: {some: {id: genresIDs.length > 0 ? {in: genresIDs} : undefined}}
                    },
                orderBy: getOrdering(ordering),
                select: {
                    id: true
                },
                skip,
                take
            })

        const fullData = await this.getFullMoviesDataByIds(movieIDs.map(id => id.id))

        // восстанавливаем исходный порядок
        return movieIDs.map(movieID => fullData.find(movie => movie.id === movieID.id))

    }

    async getFullMoviesDataByIds(movieIds: string[]) {
        const averageRatings = await this.getMoviesAverageRatingByIds(movieIds)
        const movieData = await this.getMoviesDataWithGenresByIds(movieIds)

        return movieData.map((movieData) => ({
            ...movieData,
            mean_rating: averageRatings.find((ar) => ar.movieId == movieData.id)!._avg.rating || 0
        }))
    }

    async getMoviesAverageRatingByIds(movieIds: string[]) {
        if (this._testDb) {
            return this._client.testRating.groupBy({
                by: ['movieId'],
                where: {type: 'EXPLICIT', 'movieId': {in: movieIds},},
                _avg: {
                    rating: true
                }
            });
        }
        return this._client.rating.groupBy({
            by: ['movieId'],
            where: {type: 'EXPLICIT', 'movieId': {in: movieIds},},
            _avg: {
                rating: true
            }
        });
    }

    async getMoviesDataWithGenresByIds(movieIds: string[]) {
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
                            id: true,
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
                        id: true,
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
        'getFullMoviesDataByIds': mixin.getFullMoviesDataByIds.bind(mixin),
        'searchMovies':mixin.searchMovies.bind(mixin),
    }
}