import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient, SimilarityType} from "@prisma/client";

class UserSimilarityDeleteDAO__mixin extends DAOMixinHelper{
    async deleteAll(){
        this._testDb ?await this._client.testUsersSimilarity.deleteMany() :await this._client.usersSimilarity.deleteMany()
    }

    async deleteByType(typeSimilarity:SimilarityType){
        this._testDb ? await this._client.testUsersSimilarity.deleteMany({where:{type:SimilarityType.OTIAI}}) :await this._client.usersSimilarity.deleteMany({where:{type:SimilarityType.OTIAI}})
    }
}


export function createUserSimilarityDeleteDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserSimilarityDeleteDAO__mixin(client,testDb)

    return {
        'deleteAll':mixin.deleteAll.bind(mixin),
        'deleteByType':mixin.deleteByType.bind(mixin)
    }
}