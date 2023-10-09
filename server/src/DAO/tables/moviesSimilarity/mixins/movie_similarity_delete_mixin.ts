import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient, SimilarityType} from "@prisma/client";

class MoviesSimilarityDeleteDAO__mixin extends DAOMixinHelper{
    async deleteAll(){
        this._testDb ? await this._client.testMoviesSimilarity.deleteMany() : await this._client.moviesSimilarity.deleteMany()
    }

    async deleteByType(typeSimilarity:SimilarityType){
        this._testDb ? await this._client.testMoviesSimilarity.deleteMany({where:{type:typeSimilarity}}) : await this._client.moviesSimilarity.deleteMany({where:{type:typeSimilarity}})
    }
}


export function createMoviesSimilarityDeleteDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new MoviesSimilarityDeleteDAO__mixin(client,testDb)

    return {
        'deleteAll':mixin.deleteAll.bind(mixin),
        'deleteByType':mixin.deleteByType.bind(mixin),
    }
}