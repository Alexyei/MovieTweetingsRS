import {PrismaClient} from "@prisma/client";
import {createUserEventGetDAOMixin} from "./mixins/user_event_get_mixin";

export default function getUserEventDAO(client:PrismaClient,testDb:boolean){
    return Object.assign({},
        createUserEventGetDAOMixin(client,testDb),
    )
}