import {PrismaClient} from "@prisma/client";
import {createPriorityRatingGetDAOMixin} from "./mixin/priority_rating_get.mixin";

export default function getPriorityRatingDAO(client:PrismaClient,testDb:boolean){
    return Object.assign({},
        createPriorityRatingGetDAOMixin(client,testDb),
    )
}