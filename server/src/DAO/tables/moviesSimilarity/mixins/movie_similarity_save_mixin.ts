import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient, SimilarityType} from "@prisma/client";
import {MovieSimilarityT} from "../../../../types/similarity.types";

class MoviesSimilaritySaveDAO__mixin extends DAOMixinHelper{
    async saveMany(movieSimsData: MovieSimilarityT[], skipDuplicates=false) {
        this._testDb ? await this._client.testMoviesSimilarity.createMany({data: movieSimsData,skipDuplicates}) : await this._client.moviesSimilarity.createMany({data: movieSimsData,skipDuplicates})
    }

}


export function createMoviesSimilaritySaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new MoviesSimilaritySaveDAO__mixin(client,testDb)

    return {
        'saveMany':mixin.saveMany.bind(mixin),
    }
}