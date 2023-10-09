import {DAOMixinHelper} from "../../../dao_helper";
import {UserT} from "../../../../types/user.types";
import {PrismaClient} from "@prisma/client";

class UserGetDAO__mixin extends DAOMixinHelper{
    async getUsersDataByIds(userIds:number[]){
        if (this._testDb){
            return this._client.testUser.findMany({
                where: {id: {in: userIds},},
                select: {id: true, name: true},
            });
        }
        return this._client.user.findMany({
            where: {id: {in: userIds},},
            select: {id: true, name: true},
        });
    }
}


export function createUserGetDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserGetDAO__mixin(client,testDb)

    return {
        'getUsersDataByIds':mixin.getUsersDataByIds.bind(mixin),
    }
}