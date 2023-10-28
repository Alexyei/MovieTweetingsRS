import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {RatingWithTypeT} from "../../../../types/rating.types";

class RatingSaveDAO__mixin extends DAOMixinHelper{
    async saveOne(rating:RatingWithTypeT){

        const row =  this._testDb ?
            await this._client.testRating.findFirst({where: {authorId: rating.authorId, movieId: rating.movieId, type:rating.type}}) :
            await this._client.rating.findFirst({where: {authorId: rating.authorId, movieId: rating.movieId, type:rating.type}})

        if (row){
            this._testDb ?
                await this._client.testRating.update({where: {id:row.id}, data:{rating:rating.rating}}) :
                await this._client.rating.update({where: {id:row.id}, data:{rating:rating.rating}})
        }
        else{
            this._testDb ?
                await this._client.testRating.create({data:rating}) :
                await this._client.rating.create({data:rating})
        }

    }
    async saveMany(ratingsData: RatingWithTypeT[]) {
        this._testDb ? await this._client.testRating.createMany({data: ratingsData}) : await this._client.rating.createMany({data: ratingsData})
    }

}


export function createRatingSaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new RatingSaveDAO__mixin(client,testDb)

    return {
        'saveOne':mixin.saveOne.bind(mixin),
        'saveMany':mixin.saveMany.bind(mixin),
    }
}