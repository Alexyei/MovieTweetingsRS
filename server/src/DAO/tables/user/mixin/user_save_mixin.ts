import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {UserDataT, UserSaveT, UserT} from "../../../../types/user.types";

class UserSaveDAO__mixin extends DAOMixinHelper{
    async saveMany(usersData: UserT[],){
        this._testDb ? await this._client.testUser.createMany({data: usersData}) : await this._client.user.createMany({data: usersData})
    }

    async saveOne(userData: UserSaveT):Promise<UserDataT>{
        return this._testDb ? await this._client.testUser.create({data: userData, select: {id: true, login: true, email:true,role:true}}) : await this._client.user.create({data: userData,select: {id: true, login: true, email:true,role:true}})
    }
}


export function createUserSaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserSaveDAO__mixin(client,testDb)

    return {
        'saveMany':mixin.saveMany.bind(mixin),
        'saveOne':mixin.saveOne.bind(mixin)
    }
}