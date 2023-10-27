import {PrismaClient} from "@prisma/client";
import {createGenreGetDAOMixin} from "./mixin/genre_get_mixin";

export default function getGenreDAO(client:PrismaClient,testDb:boolean){
    return Object.assign({},
        createGenreGetDAOMixin(client,testDb),
    )
}