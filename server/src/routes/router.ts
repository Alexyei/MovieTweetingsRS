import {Router} from "express";
import connectAuthRoutes from "./authRoutes";
import connectMovieRoutes from "./movieRoutes";
import connectRecommendRoutes from "./recommenderRoutes";

const router = Router();

function createRouter() {
    connectAuthRoutes(router)
    connectMovieRoutes(router)
    connectRecommendRoutes(router)
    //POST collector/log - сбор данных о пользователе

    //GET rec/pop/:userId&take=10
    //GET rec/bestsellers/:userId&take=10
    //GET rec/cf-nb-item/:userId&take=10
    //GET rec/cf-nb-user/:userId&take=10
    //GET rec/association_rules/:movieId&take=10

    //GET sim/items/:movieId/:method
    //GET sim/users/:movieId/:method
    //GET sim/items/:movieId/:method ->views.similar_content ->lda_similarity

    //GET movie/:page
    //GET movie/genre/:genreId/:page
    //GET movie/details
    //GET movie/search&searchRequest

    //GET mylogs
    //GET myratings
    //POST myrating
    //POST BUY
    //POST MYLIST
    
}

createRouter()

export default router;