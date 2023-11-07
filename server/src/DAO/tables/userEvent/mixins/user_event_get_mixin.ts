import {DAOMixinHelper} from "../../../dao_helper";
import {MovieT} from "../../../../types/movie.types";
import {PrismaClient} from "@prisma/client";

class UserEventGetDAO__mixin extends DAOMixinHelper {

    async getPurchasesForUser(userId: number, take: number = 10) {
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
}


export function createUserEventGetDAOMixin(client: PrismaClient, testDb: boolean) {
    const mixin = new UserEventGetDAO__mixin(client, testDb)

    return {
        'getSessionsWithBuy':mixin.getSessionsWithBuy.bind(mixin),
        'getCountBySessionIDs':mixin.getCountBySessionIDs.bind(mixin),
        'getPurchasesForUser': mixin.getPurchasesForUser.bind(mixin),
        'getUserEvents': mixin.getUserEvents.bind(mixin),
    }
}