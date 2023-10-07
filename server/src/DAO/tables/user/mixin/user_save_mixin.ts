import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {UserT} from "../../../../types/user.types";

class UserSaveDAO__mixin extends DAOMixinHelper{
    saveMany(usersData: UserT[],){
        this._testDb ? this._client.testUser.createMany({data: usersData}) : this._client.user.createMany({data: usersData})
    }
}


export function createUserSaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserSaveDAO__mixin(client,testDb)

    return {
        'saveMany':mixin.saveMany.bind(mixin),
    }
}