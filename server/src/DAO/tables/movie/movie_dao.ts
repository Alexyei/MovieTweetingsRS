import {PrismaClient} from "@prisma/client";
import {createMovieDeleteDAOMixin} from "./mixins/movie_delete_mixin";
import {createMovieSaveDAOMixin} from "./mixins/movie_save_mixin";
import {createMovieGetDAOMixin} from "./mixins/movie_get_mixin";

export default function getMovieDAO(client:PrismaClient,testDb:boolean){
    return Object.assign({},
        createMovieGetDAOMixin(client,testDb),
        createMovieDeleteDAOMixin(client, testDb),
        createMovieSaveDAOMixin(client,testDb)
    )
}