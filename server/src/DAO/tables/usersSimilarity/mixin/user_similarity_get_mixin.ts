import {DAOMixinHelper} from "../../../dao_helper";
import {UserT} from "../../../../types/user.types";
import {PrismaClient, SimilarityType} from "@prisma/client";

class UserSimilarityGetDAO__mixin extends DAOMixinHelper{
    async count(){
        return this._testDb ? this._client.testUsersSimilarity.count() : this._client.usersSimilarity.count();
    }

    async all(){
        return this._testDb ? this._client.testUsersSimilarity.findMany() : this._client.usersSimilarity.findMany();
    }

    async getCandidatesPairsByUserId(userId:number,type:SimilarityType,take=100,min_sims = 0.2){
        if (this._testDb){
            return this._client.testUsersSimilarity.findMany({
                where: {
                    source: userId,
                    target: {not: userId},
                    similarity: {gte: min_sims},
                    type: type
                },
                orderBy: {
                    similarity: 'desc'
                },
                take: take
            });
        }
        return this._client.usersSimilarity.findMany({
            where: {
                source: userId,
                target: {not: userId},
                similarity: {gte: min_sims},
                type: type
            },
            orderBy: {
                similarity: 'desc'
            },
            take: take
        });
    }

    async getSimilaritiesForUser(userID:number){
        return this._testDb ? this._client.testUsersSimilarity.findMany(
            {where: {source: userID},select:{target:true,similarity:true,type:true}}) :
            this._client.usersSimilarity.findMany({where: {source: userID},select:{target:true,similarity:true,type:true}});
    }
}


export function createUserSimilarityGetDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserSimilarityGetDAO__mixin(client,testDb)

    return {
        'count':mixin.count.bind(mixin),
        'all':mixin.all.bind(mixin),
        'getCandidatesPairsByUserId':mixin.getCandidatesPairsByUserId.bind(mixin),
        'getSimilarityForUser':mixin.getSimilaritiesForUser.bind(mixin)
    }
}