import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";

class MovieDeleteDAO__mixin extends DAOMixinHelper{
    deleteAll(){
        this._testDb ? this._client.testMovie.deleteMany() : this._client.movie.deleteMany()
    }
}


export function createMovieDeleteDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new MovieDeleteDAO__mixin(client,testDb)

    return {
        'deleteAll':mixin.deleteAll.bind(mixin),
    }
}