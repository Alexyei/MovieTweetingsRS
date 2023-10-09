import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {MovieT} from "../../../../types/movie.types";
import {RatingWithTypeT} from "../../../../types/rating.types";

class RatingSaveDAO__mixin extends DAOMixinHelper{
    async saveMany(ratingsData: RatingWithTypeT[]) {
        this._testDb ? await this._client.testRating.createMany({data: ratingsData}) : await this._client.rating.createMany({data: ratingsData})
    }

}


export function createRatingSaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new RatingSaveDAO__mixin(client,testDb)

    return {
        'saveMany':mixin.saveMany.bind(mixin),
    }
}