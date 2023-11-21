import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient, SimilarityType} from "@prisma/client";

class AssociationRuleDeleteDAO__mixin extends DAOMixinHelper{
    async deleteAll(){
        this._testDb ?await this._client.testAssociationRule.deleteMany() :await this._client.associationRule.deleteMany()
    }
}


export function createAssociationRuleDeleteDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new AssociationRuleDeleteDAO__mixin(client,testDb)

    return {
        'deleteAll':mixin.deleteAll.bind(mixin),
    }
}