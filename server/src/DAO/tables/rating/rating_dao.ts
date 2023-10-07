import {PrismaClient} from "@prisma/client";
import {createRatingGetDAOMixin} from "./mixin/rating_get_mixin";
import {createRatingDeleteDAOMixin} from "./mixin/rating_delete_mixin";
import {createRatingSaveDAOMixin} from "./mixin/rating_save_mixin";

export default function getRatingDAO(client:PrismaClient,testDb:boolean){
    return Object.assign({},
        createRatingGetDAOMixin(client,testDb),
        createRatingDeleteDAOMixin(client, testDb),
        createRatingSaveDAOMixin(client,testDb)
    )
}