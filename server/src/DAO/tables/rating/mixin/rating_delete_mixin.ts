import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient, RatingType} from "@prisma/client";
import {RatingWithTypeT} from "../../../../types/rating.types";
class RatingDeleteDAO__mixin extends DAOMixinHelper{
    async deleteAll() {
        this._testDb ? await this._client.testRating.deleteMany() : await this._client.rating.deleteMany()
    }

    async deleteByType(type:RatingType='IMPLICIT') {
        this._testDb ? await this._client.testRating.deleteMany({where:{type}}) : await this._client.rating.deleteMany({where:{type}})
    }
}


export function createRatingDeleteDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new RatingDeleteDAO__mixin(client,testDb)

    return {
        'deleteAll':mixin.deleteAll.bind(mixin),
        'deleteByType':mixin.deleteByType.bind(mixin)
    }
}