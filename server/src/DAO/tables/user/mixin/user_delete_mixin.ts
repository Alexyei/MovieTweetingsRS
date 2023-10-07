import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";

class UserDeleteDAO__mixin extends DAOMixinHelper{
    deleteAll(){
        this._testDb ? this._client.testUser.deleteMany() : this._client.user.deleteMany()
    }

}


export function createUserDeleteDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserDeleteDAO__mixin(client,testDb)

    return {
        'deleteAll':mixin.deleteAll.bind(mixin),
    }
}