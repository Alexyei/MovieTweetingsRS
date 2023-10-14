import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {UserDataT, UserSaveT, UserT} from "../../../../types/user.types";

class UserSaveDAO__mixin extends DAOMixinHelper{
    async saveMany(usersData: UserT[],){
        this._testDb ? await this._client.testUser.createMany({data: usersData}) : await this._client.user.createMany({data: usersData})
    }

    async saveOne(userData: UserSaveT):Promise<UserDataT>{
        //https://github.com/prisma/prisma/issues/1938
        if (this._testDb){
            const maxId = await this._client.testUser.aggregate({
                _max: {
                    id: true,
                },
            })
            const id = maxId._max.id || 0
            return this._client.testUser.create({
                data: {id, ...userData},
                select: {id: true, login: true, email: true, role: true}
            });

        }
        else{
            const maxId = await this._client.user.aggregate({
                _max: {
                    id: true,
                },
            })
            const id = (maxId._max.id|| 0) + 1
            return this._client.user.create({
                data: {id, ...userData},
                select: {id: true, login: true, email: true, role: true}
            });
        }
    }
}


export function createUserSaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserSaveDAO__mixin(client,testDb)

    return {
        'saveMany':mixin.saveMany.bind(mixin),
        'saveOne':mixin.saveOne.bind(mixin)
    }
}