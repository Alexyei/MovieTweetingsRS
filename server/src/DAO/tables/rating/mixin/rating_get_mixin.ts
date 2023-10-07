import {DAOMixinHelper} from "../../../dao_helper";
import {MovieT} from "../../../../types/movie.types";
import {PrismaClient} from "@prisma/client";

class RatingGetDAO__mixin extends DAOMixinHelper{
    async getAvgRatings() {
        let ratings = []
        if (this._testDb)
            ratings = await this._client.testRating.groupBy({by: 'authorId', _avg: {rating: true}, orderBy: {authorId: 'asc'}})
        else
            ratings = await this._client.rating.groupBy({by: 'authorId', _avg: {rating: true}, orderBy: {authorId: 'asc'}})

        return ratings.map((r) => ({authorId: r.authorId, _avg: r._avg.rating!}))
    }

    count() {
        return this._testDb ? this._client.testRating.count() : this._client.rating.count();
    }

    all() {
        return this._testDb ? this._client.testRating.findMany() : this._client.rating.findMany();
    }

    async getUniqueMovieIds(){
        let uniqueMovieIds = []
        if (this._testDb)
            uniqueMovieIds = await this._client.testRating.findMany({
                distinct: ['movieId'],
                orderBy: {movieId: 'asc',},
                select: {movieId: true},
            })
        else
            uniqueMovieIds = await this._client.rating.findMany({
                distinct: ['movieId'],
                orderBy: {movieId: 'asc',},
                select: {movieId: true},
            })
        return uniqueMovieIds.map(mid=>mid.movieId);
    }

    async getUniqueUserIds(){
        let uniqueUserIds = []
        if (this._testDb)
            uniqueUserIds = await this._client.testRating.findMany({
                distinct: ['authorId'],
                orderBy: {authorId: 'asc',},
                select: {authorId: true},
            })
        else
            uniqueUserIds = await this._client.rating.findMany({
                distinct: ['authorId'],
                orderBy: {authorId: 'asc',},
                select: {authorId: true},
            })
        return uniqueUserIds.map(uid=>uid.authorId);
    }

    getByMovieIds(movieIds:string[]){
        return  this._testDb ? this._client.testRating.findMany({where: {movieId: {in: movieIds}}}) : this._client.rating.findMany({where: {movieId: {in: movieIds}}})
    }

    getByUserIds(userIds:number[]){
        return  this._testDb ? this._client.testRating.findMany({where: {authorId: {in: userIds}}}) : this._client.rating.findMany({where: {authorId: {in: userIds}}})
    }
}


export function createRatingGetDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new RatingGetDAO__mixin(client,testDb)

    return {
        'getAvgRatings':mixin.getAvgRatings.bind(mixin),
        'all':mixin.all.bind(mixin),
        'count':mixin.count.bind(mixin),
        'getUniqueMovieIds':mixin.getUniqueMovieIds.bind(mixin),
        'getUniqueUserIds':mixin.getUniqueUserIds.bind(mixin),
        'getByMovieIds':mixin.getByMovieIds.bind(mixin),
        'getByUserIds':mixin.getByUserIds.bind(mixin),
    }
}