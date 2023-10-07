import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {RatingWithTypeT} from "../../../../types/rating.types";

class RatingDeleteDAO__mixin extends DAOMixinHelper{
    deleteMany() {
        this._testDb ? this._client.testRating.deleteMany() : this._client.rating.deleteMany()
    }
}


export function createRatingDeleteDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new RatingDeleteDAO__mixin(client,testDb)

    return {
        'deleteMany':mixin.deleteMany.bind(mixin),
    }
}