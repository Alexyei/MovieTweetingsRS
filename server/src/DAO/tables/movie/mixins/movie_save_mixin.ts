import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {MovieT} from "../../../../types/movie.types";

class MovieSaveDAO__mixin extends DAOMixinHelper{
    async saveMany(moviesData: MovieT[]) {
        this._testDb ? await this._client.testMovie.createMany({data: moviesData}) : await this._client.movie.createMany({data: moviesData})
    }
}


export function createMovieSaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new MovieSaveDAO__mixin(client,testDb)

    return {
        'saveMany':mixin.saveMany.bind(mixin),
    }
}