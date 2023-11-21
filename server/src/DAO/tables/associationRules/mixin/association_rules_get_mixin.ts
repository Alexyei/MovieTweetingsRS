import {DAOMixinHelper} from "../../../dao_helper";
import {UserT} from "../../../../types/user.types";
import {PrismaClient, SimilarityType} from "@prisma/client";

class AssociationRuleGetDAO__mixin extends DAOMixinHelper{


    async getAssociationRules(movieId:string,take:number|undefined=100){
        if (this._testDb){
            return this._client.testAssociationRule.findMany({
                where: {
                    source: movieId,
                },
                orderBy: {
                    confidence: 'desc'
                },
                take: take
            });
        }
        return this._client.associationRule.findMany({
            where: {
                source: movieId,
            },
            orderBy: {
                confidence: 'desc'
            },
            take: take
        });
    }


}


export function createAssociationRuleGetDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new AssociationRuleGetDAO__mixin(client,testDb)

    return {
        'getAssociationRules':mixin.getAssociationRules.bind(mixin)
    }
}