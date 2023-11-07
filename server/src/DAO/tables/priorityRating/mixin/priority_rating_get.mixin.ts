import {DAOMixinHelper} from "../../../dao_helper";
import {MovieSimilarityT} from "../../../../types/similarity.types";
import {Prisma, PrismaClient, Rating, TestRating} from "@prisma/client";

class PriorityRatingGetDAO__mixin extends DAOMixinHelper{
    #tableName = this._testDb ? Prisma.raw("TestRating") : Prisma.raw("Rating")
    
    async getAvgRatings(){
        // return this._client.$queryRaw<{authorId: number, _avg: number}[]>(Prisma.sql `SELECT r."authorId", AVG(r."rating") as _avg FROM "${this.#tableName}" r WHERE r.type = 'EXPLICIT' OR (r.type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0) GROUP BY r."authorId" ORDER BY r."authorId" ASC`)

        const ratings = await this.all()
        const authorsIds = await this.getUniqueUserIds()

        return authorsIds.map((authorId) =>{
            const userRatings = ratings.filter((rating) => rating.authorId == authorId)
            const sum = userRatings.reduce((acc, currentValue) => acc+ currentValue.rating ,0)
                const _avg = (sum / userRatings.length) || 0
            return {authorId, _avg }
        })
        // const ratings = this._testDb ?
        //     await this._client.testRating.groupBy({
        //         by: ['authorId', 'type'],
        //         _avg: {
        //             rating: true,
        //         },
        //         orderBy: {
        //             authorId: 'asc',
        //         },
        // }) : await this._client.rating.groupBy({
        //         by: ['authorId', 'type'],
        //         _avg: {
        //             rating: true,
        //         },
        //         orderBy: {
        //             authorId: 'asc',
        //         }})
        //
        // const filtered =ratings.filter(rating => {
        //     if (rating.type == 'EXPLICIT') return true
        //     return !ratings.find(r => (r.authorId == rating.authorId) &&(r.type == 'EXPLICIT'));
        // })
        // console.log(filtered.length, ratings.length)
        //
        // return filtered.map(fr=>({authorId:fr.authorId,_avg:fr._avg.rating || 0}))
    }

    async allWithTypesByUserID(userID:number){
        const ratings = this._testDb ? await this._client.testRating.findMany({where: {authorId: userID}}) : await this._client.rating.findMany({where: {authorId: userID}})

        const explicit = ratings.filter(r=>r.type=='EXPLICIT')
        const implicit = ratings.filter(r=>r.type=='IMPLICIT')

        const priority = ratings.filter(rating => {
            if (rating.type == 'EXPLICIT') return true
            return !ratings.find(r => (r.authorId == rating.authorId) &&(r.type == 'EXPLICIT') && (r.movieId == rating.movieId));
        })

        return {
            explicit,implicit,priority
        }
    }

    async all(){
        // return this._client.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${this.#tableName}" r WHERE type = 'EXPLICIT' OR (type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)
        const ratings = this._testDb ? await this._client.testRating.findMany() : await this._client.rating.findMany()

        return ratings.filter(rating => {
            if (rating.type == 'EXPLICIT') return true
            return !ratings.find(r => (r.authorId == rating.authorId) &&(r.type == 'EXPLICIT') && (r.movieId == rating.movieId));
        })
    }
    async getUniqueMovieIds(){
        // const uniqueMovieIds = await this._client.$queryRaw<{'movieId':string}[]>(Prisma.sql`SELECT DISTINCT s."movieId" FROM (SELECT * FROM "${this.#tableName}" r WHERE type = 'EXPLICIT' OR (type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)) s ORDER BY s."movieId" ASC`)
        // return uniqueMovieIds.map(mid=>mid.movieId);

        const ratings = this._testDb ? await this._client.testRating.findMany({where:{},distinct: ['movieId'],orderBy: {movieId:'asc'}}) : await this._client.rating.findMany({where:{},distinct: ['movieId'],orderBy: {movieId:'asc'}})
        return ratings.map(mid=>mid.movieId);
    }
    async getUniqueUserIds(){
        // const uniqueUserIds = await this._client.$queryRaw<{'authorId':number}[]>(Prisma.sql`SELECT DISTINCT s."authorId" FROM (SELECT * FROM "${this.#tableName}" r WHERE type = 'EXPLICIT' OR (type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)) s ORDER BY s."authorId" ASC`)
        // return uniqueUserIds.map(uid=>uid.authorId);

        const ratings = this._testDb ? await this._client.testRating.findMany({where:{},distinct: ['authorId'],orderBy: {authorId:'asc'}}) : await this._client.rating.findMany({where:{},distinct: ['authorId'],orderBy: {authorId:'asc'}})
        return ratings.map(mid=>mid.authorId);
    }
    async getByUserId(userId:number){
        // return this._client.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${this.#tableName}" r WHERE (type = 'EXPLICIT' AND "authorId" = ${userId}) OR (type = 'IMPLICIT' AND "authorId" = ${userId} AND NOT EXISTS (SELECT * FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT'))`)

        const ratings = this._testDb ? await this._client.testRating.findMany({
            where: {
                authorId: userId,
            }
        }) : await this._client.rating.findMany({where: {authorId: userId}})

        return ratings.filter(rating => {
            if (rating.type == 'EXPLICIT') return true
            return !ratings.find(r => (r.type == 'EXPLICIT') && (r.movieId == rating.movieId));
        })

    }

    async getByUserIds(userIds:number[]){
        if (userIds.length == 0) return []
        // return this._client.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${this.#tableName}" r WHERE (type = 'EXPLICIT' AND "authorId" IN (${Prisma.join(userIds)})) OR (type = 'IMPLICIT' AND "authorId" IN (${Prisma.join(userIds)}) AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`);
        const ratings = this._testDb ? await this._client.testRating.findMany({
            where: {
                authorId: {in: userIds},
            }
        }) : await this._client.rating.findMany({where: {authorId: {in: userIds}}})

        return ratings.filter(rating => {
            if (rating.type == 'EXPLICIT') return true
            return !ratings.find(r => (r.authorId == rating.authorId) &&(r.type == 'EXPLICIT') && (r.movieId == rating.movieId));
        })
    }

    async getByMovieIds(movieIds:string[]){
        if (movieIds.length == 0) return []
        return this._client.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${this.#tableName}" r WHERE (type = 'EXPLICIT' AND "movieId" IN (${Prisma.join(movieIds)})) OR (type = 'IMPLICIT' AND "movieId" IN (${Prisma.join(movieIds)}) AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`);
    }
}


export function createPriorityRatingGetDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new PriorityRatingGetDAO__mixin(client,testDb)

    return {
        'allWithTypesByUserID':mixin.allWithTypesByUserID.bind(mixin),
        'getAvgRatings':mixin.getAvgRatings.bind(mixin),
        'all':mixin.all.bind(mixin),
        'getByUserId':mixin.getByUserId.bind(mixin),
        'getByUserIds':mixin.getByUserIds.bind(mixin),
        'getByMovieIds':mixin.getByMovieIds.bind(mixin),
        'getUniqueMovieIds':mixin.getUniqueMovieIds.bind(mixin),
        'getUniqueUserIds':mixin.getUniqueUserIds.bind(mixin),
    }
}