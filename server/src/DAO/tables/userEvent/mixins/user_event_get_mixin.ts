import {DAOMixinHelper} from "../../../dao_helper";
import {MovieT} from "../../../../types/movie.types";
import {PrismaClient} from "@prisma/client";

class UserEventGetDAO__mixin extends DAOMixinHelper{
    async getPurchasesForUser(userId: number, take: number = 10){
        let purchases = []
        if (this._testDb){
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
        }else{
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
}


export function createUserEventGetDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserEventGetDAO__mixin(client,testDb)

    return {
        'getPurchasesForUser':mixin.getPurchasesForUser.bind(mixin),
    }
}