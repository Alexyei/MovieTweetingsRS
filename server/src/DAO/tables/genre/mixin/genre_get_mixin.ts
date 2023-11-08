import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";

class GenreGetDAO__mixin extends DAOMixinHelper {

    async getGenresWithMoviesIDs(){
        const genresWithMoviesIDs = this._testDb ? await this._client.testGenre.findMany({
                where: {
                    movies: {
                        some: {},
                    },
                },
                include: {
                    movies: {select: {id: true},}
                }
        }) :
            await this._client.genre.findMany({
                where: {
                    movies: {
                        some: {},
                    },
                },
                include: {
                    movies: {select: {id: true},}
                }
            })

        const result = genresWithMoviesIDs.map((genre) => ({
            id: genre.id,
            name: genre.name,
            moviesIDs: genre.movies.map(m => m.id),
        }))

        return result.sort((a, b) => b.moviesIDs.length - a.moviesIDs.length)

    }

    // async getGenresWithMoviesCountByMoviesIDs(moviesIDs:string[]){
    //     const genresWithMovies = this._testDb ? await this._client.testGenre.findMany({
    //             where: {
    //                 movies: {
    //                     some:{
    //                         id: {in: moviesIDs},
    //                     }
    //                 },
    //             },
    //             include: {
    //                 movies: true,
    //             },
    //         }) :
    //         await this._client.genre.findMany({
    //             where: {
    //                 movies: {
    //                     some:{
    //                         id: {in: moviesIDs},
    //                     }
    //                 },
    //             },
    //             include: {
    //                 movies: true,
    //             },
    //         })
    //
    //     const genresWithMoviesCount = genresWithMovies.map((genre) => ({
    //         id:genre.id,
    //         name: genre.name,
    //         moviesCount: genre.movies.length,
    //     }));
    //
    //     return genresWithMoviesCount.sort((a, b) => b.moviesCount - a.moviesCount)
    // }

    async getGenresWithMoviesCount(){
        const genresWithMovies = this._testDb ? await this._client.testGenre.findMany({
            where: {
                movies: {
                    some: {},
                },
            },
            include: {
                movies: true,
            },
        }) :
            await this._client.genre.findMany({
                where: {
                    movies: {
                        some: {},
                    },
                },
                include: {
                    movies: true,
                },
            })

        const genresWithMoviesCount = genresWithMovies.map((genre) => ({
            id:genre.id,
            name: genre.name,
            moviesCount: genre.movies.length,
        }));

        return genresWithMoviesCount.sort((a, b) => b.moviesCount - a.moviesCount)
    }

    async getGenreDataByName(name:string){
        const genreWithMovies = this._testDb ? await this._client.testGenre.findFirst({
                where: {
                    name: {equals: name,  mode: 'insensitive'},
                    movies: {
                        some: {},
                    },
                },
                include: {
                    movies: true,
                },
            }) :
            await this._client.genre.findFirst({
                where: {
                    name: {equals: name,  mode: 'insensitive'},
                    movies: {
                        some: {},
                    },
                },
                include: {
                    movies: true,
                },
            })

        if (genreWithMovies){
            return {
                id: genreWithMovies.id,
                name: genreWithMovies.name,
                moviesCount: genreWithMovies.movies.length,
            }
        }
    }

    async all(){
        return this._testDb ? await this._client.testGenre.findMany({}) :  await this._client.genre.findMany({})
    }
}


export function createGenreGetDAOMixin(client: PrismaClient, testDb: boolean) {
    const mixin = new GenreGetDAO__mixin(client, testDb)

    return {
        // 'getGenresWithMoviesCountByMoviesIDs':mixin.getGenresWithMoviesCountByMoviesIDs.bind(mixin),
        'getGenresWithMoviesIDs':mixin.getGenresWithMoviesIDs.bind(mixin),
        'getGenresWithMoviesCount': mixin.getGenresWithMoviesCount.bind(mixin),
        'getGenreDataByName':mixin.getGenreDataByName.bind(mixin),
        'all':mixin.all.bind(mixin)
    }
}