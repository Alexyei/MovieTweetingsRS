import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient, SimilarityType} from "@prisma/client";


class MoviesSimilarityGetDAO__mixin extends DAOMixinHelper{
    async count(){
        return this._testDb ? await this._client.testMoviesSimilarity.count() : await this._client.moviesSimilarity.count();
    }

    async all(){
        return this._testDb ? await this._client.testMoviesSimilarity.findMany() : await this._client.moviesSimilarity.findMany();
    }

    async getSimilaritiesForMovie(movieID:string){
        return this._testDb ? this._client.testMoviesSimilarity.findMany(
                {where: {source: movieID},select:{target:true,similarity:true,type:true}}) :
            this._client.moviesSimilarity.findMany({where: {source: movieID},select:{target:true,similarity:true,type:true}});
    }

    async getCandidatesByTargetId(userMovieIds:string[], targetId:string,type:SimilarityType,take=100,min_sims = 0.2){
        if (this._testDb){
            return this._client.testMoviesSimilarity.findMany({
                where: {
                    source: {in: userMovieIds},
                    target: targetId,
                    similarity: {gte: min_sims},
                    type: type
                },
                orderBy: {
                    similarity: 'desc'
                },
                take: take
            });
        }
        return this._client.moviesSimilarity.findMany({
            where: {
                source: {in: userMovieIds},
                target: targetId,
                similarity: {gte: min_sims},
                type: type
            },
            orderBy: {
                similarity: 'desc'
            },
            take: take
        });
    }

    async getAllCandidates(userMovieIds:string[], type:SimilarityType,take=100,min_sims = 0.2){
        if (this._testDb){
            return this._client.testMoviesSimilarity.findMany({
                where: {
                    source: {in: userMovieIds},
                    target: {notIn: userMovieIds},
                    similarity: {gt: min_sims},
                    type: type
                },
                orderBy: {
                    similarity: 'desc'
                },
                take: take
            });
        }
        return this._client.moviesSimilarity.findMany({
            where: {
                source: {in: userMovieIds},
                target: {notIn: userMovieIds},
                similarity: {gte: min_sims},
                type: type
            },
            orderBy: {
                similarity: 'desc'
            },
            take: take
        });
    }
}


export function createMoviesSimilarityGetDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new MoviesSimilarityGetDAO__mixin(client,testDb)

    return {
        'count':mixin.count.bind(mixin),
        'all':mixin.all.bind(mixin),
        'getSimilaritiesForMovie':mixin.getSimilaritiesForMovie.bind(mixin),
        'getCandidatesByTargetId':mixin.getCandidatesByTargetId.bind(mixin),
        'getAllCandidates':mixin.getAllCandidates.bind(mixin)
    }
}