import {PrismaClient} from "@prisma/client";
import {createMoviesSimilarityGetDAOMixin} from "./mixins/movie_similarity_get_mixin";
import {createMoviesSimilarityDeleteDAOMixin} from "./mixins/movie_similarity_delete_mixin";
import {createMoviesSimilaritySaveDAOMixin} from "./mixins/movie_similarity_save_mixin";

export default function getMoviesSimilarityDAO(client:PrismaClient,testDb:boolean){
    return Object.assign({},
        createMoviesSimilarityGetDAOMixin(client,testDb),
        createMoviesSimilarityDeleteDAOMixin(client, testDb),
        createMoviesSimilaritySaveDAOMixin(client,testDb)
    )
}