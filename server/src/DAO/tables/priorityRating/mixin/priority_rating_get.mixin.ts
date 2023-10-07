import {DAOMixinHelper} from "../../../dao_helper";
import {MovieSimilarityT} from "../../../../types/similarity.types";
import {Prisma, PrismaClient, Rating, TestRating} from "@prisma/client";

class PriorityRatingGetDAO__mixin extends DAOMixinHelper{
    #tableName = this._testDb ? Prisma.raw("TestRating") : Prisma.raw("Rating")
    
    getAvgRatings(){
        return this._client.$queryRaw<{authorId: number, _avg: number}[]>(Prisma.sql `SELECT r."authorId", AVG(r."rating") as _avg FROM "${this.#tableName}" r WHERE r.type = 'EXPLICIT' OR (r.type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0) GROUP BY r."authorId" ORDER BY r."authorId" ASC`)
    }

    all(){
        return this._client.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${this.#tableName}" r WHERE type = 'EXPLICIT' OR (type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)
    }
    getByUserId(userId:number){
        return this._client.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${this.#tableName}" r WHERE (type = 'EXPLICIT' AND "authorId" = ${userId}) OR (type = 'IMPLICIT' AND "authorId" = ${userId} AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)
    }

    getByUserIds(userIds:number[]){
        if (userIds.length == 0) return []
        return this._client.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${this.#tableName}" r WHERE (type = 'EXPLICIT' AND "authorId" IN (${Prisma.join(userIds)})) OR (type = 'IMPLICIT' AND "authorId" IN (${Prisma.join(userIds)}) AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`);
    }

    getByMovieIds(movieIds:string[]){
        if (movieIds.length == 0) return []
        return this._client.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${this.#tableName}" r WHERE (type = 'EXPLICIT' AND "movieId" IN (${Prisma.join(movieIds)})) OR (type = 'IMPLICIT' AND "movieId" IN (${Prisma.join(movieIds)}) AND (SELECT COUNT(*) FROM "${this.#tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`);
    }
}


export function createPriorityRatingGetDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new PriorityRatingGetDAO__mixin(client,testDb)

    return {
        'getAvgRatings':mixin.getAvgRatings.bind(mixin),
        'all':mixin.all.bind(mixin),
        'getByUserId':mixin.getByUserId.bind(mixin),
        'getByUserIds':mixin.getByUserIds.bind(mixin),
        'getByMovieIds':mixin.getByMovieIds.bind(mixin),
    }
}