import {PrismaClient} from "@prisma/client";
import {createUserGetDAOMixin} from "./mixin/user_get_mixin";
import {createUserDeleteDAOMixin} from "./mixin/user_delete_mixin";
import {createUserSaveDAOMixin} from "./mixin/user_save_mixin";

export default function getUserDAO(client:PrismaClient,testDb:boolean){
    return Object.assign({},
        createUserGetDAOMixin(client,testDb),
        createUserDeleteDAOMixin(client, testDb),
        createUserSaveDAOMixin(client,testDb)
    )
}