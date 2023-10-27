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
}


export function createGenreGetDAOMixin(client: PrismaClient, testDb: boolean) {
    const mixin = new GenreGetDAO__mixin(client, testDb)

    return {
        'getGenresWithMoviesCount': mixin.getGenresWithMoviesCount.bind(mixin)
    }
}