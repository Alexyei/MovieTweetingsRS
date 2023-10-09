import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {UserT} from "../../../../types/user.types";

class UserSaveDAO__mixin extends DAOMixinHelper{
    async saveMany(usersData: UserT[],){
        this._testDb ? await this._client.testUser.createMany({data: usersData}) : await this._client.user.createMany({data: usersData})
    }
}


export function createUserSaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserSaveDAO__mixin(client,testDb)

    return {
        'saveMany':mixin.saveMany.bind(mixin),
    }
}