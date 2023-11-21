import {DAOMixinHelper} from "../../../dao_helper";
import {MovieT} from "../../../../types/movie.types";
import {PrismaClient} from "@prisma/client";

class UserEventGetDAO__mixin extends DAOMixinHelper {
    async all(){
        return this._testDb ? this._client.testUserEvent.findMany() : this._client.userEvent.findMany();
    }

    async getPurchasesForUser(userId: number|undefined, take: number = 10) {
        let purchases = []
        if (this._testDb) {
            purchases = await this._client.testUserEvent.groupBy({
                by: ['movieId'],
                where: {
                    NOT: {
                        userId: userId,
                    },
                    event: 'BUY'
                },
                _count: {
                    userId: true,
                },
                orderBy: [
                    {
                        _count: {
                            userId: 'desc',

                        },
                    },
                ],

                take: take,
            })
        } else {
            purchases = await this._client.userEvent.groupBy({
                by: ['movieId'],
                where: {
                    NOT: {
                        userId: userId,
                    },
                    event: 'BUY'
                },
                _count: {
                    userId: true,
                },
                orderBy: [
                    {
                        _count: {
                            userId: 'desc',

                        },
                    },
                ],

                take: take,
            })
        }
        return purchases.map(p => {
            return {
                movieId: p.movieId,
                count: p._count.userId,
            }
        })
    }

    async getUserEvents(userId: number) {
        if (this._testDb) {
            return this._client.testUserEvent.groupBy({
                by: ['movieId', 'genreId', 'event'],
                where: {
                    userId,
                },
                _count: {
                    event: true,
                },
                orderBy: {
                    movieId: 'asc'
                }
            })
        } else {
            return this._client.userEvent.groupBy({
                by: ['movieId', 'genreId', 'event'],
                where: {
                    userId,
                },
                _count: {
                    event: true,
                },
                orderBy: {
                    movieId: 'asc'
                }
            })
        }
    }

    async getSessionsWithBuy() {
        if (this._testDb) {
            return this._client.testUserEvent.findMany({
                where: {
                    event: 'BUY',
                },
                distinct: ['sessionId'],
            })
        } else {
            return this._client.userEvent.findMany({
                where: {
                    event: 'BUY',
                },
                distinct: ['sessionId'],
            })
        }
    }

    async getBuyEvents(){
        if (this._testDb) {
            return this._client.testUserEvent.findMany({
                where: {
                    event: 'BUY',
                },
            })
        } else {
            return this._client.userEvent.findMany({
                where: {
                    event: 'BUY',
                },
            })
        }
    }

    async getCountBySessionIDs(sessionIDs: string[], include: boolean = true) {
        const data = this._testDb ?
            await this._client.testUserEvent.groupBy({
                by: ['event'],
                where: {
                    sessionId: include? {in: sessionIDs}: {notIn: sessionIDs},
                },
                _count:{
                    id:true
                },
                orderBy: {
                    _count: {
                        id: 'desc'
                    }
                }
            }) :
            await this._client.userEvent.groupBy({
                by: ['event'],
                where: {
                    sessionId: include? {in: sessionIDs}: {notIn: sessionIDs},
                },
                _count:{
                    id:true
                },
                orderBy: {
                    _count: {
                        id: 'desc'
                    }
                }
            })

        return data.map(d=>({event:d.event,count:d._count.id}))
    }

    async getRecentPurchases(take:number=10){
        if (this._testDb) {
            return this._client.testUserEvent.findMany({
                where: {
                    event: 'BUY',
                },
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    userId:true,
                    movieId:true,
                    createdAt:true
                },
                take
            })
        } else {
            return this._client.userEvent.findMany({
                where: {
                    event: 'BUY',
                },
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    userId:true,
                    movieId:true,
                    createdAt:true
                },
                take
            })
        }
    }

    async getRecentUserEvents(userID:number,take:number=10){
        if (this._testDb) {
            return this._client.testUserEvent.findMany({
                where: {
                    userId: userID
                },
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    userId:true,
                    movieId:true,
                    genreId:true,
                    event:true,
                    createdAt:true
                },
                take
            })
        } else {
            return this._client.userEvent.findMany({
                where: {
                    userId: userID
                },
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    userId:true,
                    movieId:true,
                    genreId:true,
                    event:true,
                    createdAt:true
                },
                take
            })
        }
    }

    async getPurchasesForMovie(movieId:string){
        if (this._testDb) {
            return this._client.testUserEvent.findMany({
                where: {
                    event: 'BUY',
                    movieId: movieId,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    userId:true,
                    createdAt:true
                },
            })
        } else {
            return this._client.userEvent.findMany({
                where: {
                    event: 'BUY',
                    movieId: movieId,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    userId:true,
                    createdAt:true
                },
            })
        }
    }

    async getPurchasesForPeriod(gte:Date,lt:Date|null = null) {
        if (this._testDb) {
            return this._client.testUserEvent.count({
                where: {
                    event: 'BUY',
                    createdAt:{
                        gte,
                        lt: lt? lt: undefined
                    }
                },
            })
        } else {
            return this._client.userEvent.count({
                where: {
                    event: 'BUY',
                    createdAt:{
                        gte,
                        lt: lt? lt: undefined
                    }
                },
            })
        }
    }

    async getSessionsForPeriod(gte:Date,lt:Date|null = null) {
        // count не работает с distinct в prisma
        const data = this._testDb ?
            await this._client.testUserEvent.findMany({
                where: {
                    createdAt:{
                        gte,
                        lt: lt? lt: undefined
                    }
                },
                distinct: ['sessionId'],
                select: {
                    sessionId:true
                }
            })
        :
            await this._client.userEvent.findMany({
                where: {
                    createdAt:{
                        gte,
                        lt: lt? lt: undefined
                    }
                },
                distinct: ['sessionId'],
                select: {
                    sessionId:true
                }
            })
        return data.length
    }

    async getVisitorsForPeriod(gte:Date,lt:Date|null = null) {
        const data = this._testDb ?
            await this._client.testUserEvent.findMany({
                where: {
                    createdAt:{
                        gte,
                        lt: lt? lt: undefined
                    }
                },
                distinct: ['userId'],
                select: {
                    userId: true
                }
            })
        :
            await this._client.userEvent.findMany({
                where: {
                    createdAt:{
                        gte,
                        lt: lt? lt: undefined
                    }
                },
                distinct: ['userId'],
                select: {
                    userId: true
                }
            })
        return data.length

    }

    async getSessionsWithBuyForPeriod(gte:Date,lt:Date|null = null) {
        const data = this._testDb ?
            await this._client.testUserEvent.findMany({
                where: {
                    event: 'BUY',
                    createdAt:{
                        gte,
                        lt: lt? lt: undefined
                    }
                },
                distinct: ['sessionId'],
                select: {
                    sessionId:true
                }
            })
        :
            await this._client.userEvent.findMany({
                where: {
                    event: 'BUY',
                    createdAt:{
                        gte,
                        lt: lt? lt: undefined
                    }
                },
                distinct: ['sessionId'],
                select: {
                    sessionId:true
                }
            })

        return data.length
    }
}


export function createUserEventGetDAOMixin(client: PrismaClient, testDb: boolean) {
    const mixin = new UserEventGetDAO__mixin(client, testDb)

    return {
        'all':mixin.all.bind(mixin),
        'getRecentUserEvents':mixin.getRecentUserEvents.bind(mixin),
        'getPurchasesForMovie':mixin.getPurchasesForMovie.bind(mixin),
        'getRecentPurchases':mixin.getRecentPurchases.bind(mixin),
        'getSessionsWithBuyForPeriod':mixin.getSessionsWithBuyForPeriod.bind(mixin),
        'getVisitorsForPeriod':mixin.getVisitorsForPeriod.bind(mixin),
        'getSessionsForPeriod':mixin.getSessionsForPeriod.bind(mixin),
        'getPurchasesForPeriod':mixin.getPurchasesForPeriod.bind(mixin),
        'getSessionsWithBuy':mixin.getSessionsWithBuy.bind(mixin),
        'getCountBySessionIDs':mixin.getCountBySessionIDs.bind(mixin),
        'getPurchasesForUser': mixin.getPurchasesForUser.bind(mixin),
        'getUserEvents': mixin.getUserEvents.bind(mixin),
        'getBuyEvents':mixin.getBuyEvents.bind(mixin),
    }
}