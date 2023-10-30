import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";

class GenreGetDAO__mixin extends DAOMixinHelper {
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
}


export function createGenreGetDAOMixin(client: PrismaClient, testDb: boolean) {
    const mixin = new GenreGetDAO__mixin(client, testDb)

    return {
        'getGenresWithMoviesCount': mixin.getGenresWithMoviesCount.bind(mixin),
        'getGenreDataByName':mixin.getGenreDataByName.bind(mixin)
    }
}