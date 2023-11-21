import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient, SimilarityType} from "@prisma/client";

class UserEventDeleteDAO__mixin extends DAOMixinHelper{
    async deleteAll(){
        this._testDb ?await this._client.testUserEvent.deleteMany() :await this._client.userEvent.deleteMany()
    }

}


export function createUserEventDeleteDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserEventDeleteDAO__mixin(client,testDb)

    return {
        'deleteAll':mixin.deleteAll.bind(mixin),
    }
}