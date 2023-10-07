import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient, SimilarityType} from "@prisma/client";

class MoviesSimilarityDeleteDAO__mixin extends DAOMixinHelper{
    deleteAll(){
        this._testDb ? this._client.testMoviesSimilarity.deleteMany() : this._client.moviesSimilarity.deleteMany()
    }

    deleteByType(typeSimilarity:SimilarityType){
        this._testDb ? this._client.testMoviesSimilarity.deleteMany({where:{type:typeSimilarity}}) : this._client.moviesSimilarity.deleteMany({where:{type:typeSimilarity}})
    }
}


export function createMoviesSimilarityDeleteDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new MoviesSimilarityDeleteDAO__mixin(client,testDb)

    return {
        'deleteAll':mixin.deleteAll.bind(mixin),
        'deleteByType':mixin.deleteByType.bind(mixin),
    }
}