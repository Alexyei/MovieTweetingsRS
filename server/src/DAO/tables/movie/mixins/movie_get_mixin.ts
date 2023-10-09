import {DAOMixinHelper} from "../../../dao_helper";
import {MovieT} from "../../../../types/movie.types";
import {PrismaClient} from "@prisma/client";

class MovieGetDAO__mixin extends DAOMixinHelper{
    async getMoviesDataByIds(movieIds:string[]){
        if (this._testDb){
            return this._client.testMovie.findMany({
                where: {id: {in: movieIds},},
                select: {id: true, poster_path: true, title: true},
            });
        }
        return this._client.movie.findMany({
            where: {id: {in: movieIds},},
            select: {id: true, poster_path: true, title: true},
        });
    }
}


export function createMovieGetDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new MovieGetDAO__mixin(client,testDb)

    return {
        'getMoviesDataByIds':mixin.getMoviesDataByIds.bind(mixin),
    }
}