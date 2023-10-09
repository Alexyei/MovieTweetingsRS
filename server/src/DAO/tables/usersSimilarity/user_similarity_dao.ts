import {PrismaClient} from "@prisma/client";
import {createUserSimilarityGetDAOMixin} from "./mixin/user_similarity_get_mixin";
import {createUserSimilaritySaveDAOMixin} from "./mixin/user_similarity_save_mixin";
import {createUserSimilarityDeleteDAOMixin} from "./mixin/user_similarity_delete_mixin";

export default function getUserSimilarityDAO(client:PrismaClient,testDb:boolean){
    return Object.assign({},
        createUserSimilarityGetDAOMixin(client,testDb),
        createUserSimilarityDeleteDAOMixin(client, testDb),
        createUserSimilaritySaveDAOMixin(client,testDb)
    )
}