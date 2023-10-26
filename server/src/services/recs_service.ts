import bcrypt from "bcrypt";
import {config} from "dotenv";
import {getDAO} from "../DAO/DAO";
import {UserRole} from "@prisma/client";
import {UserDataT, UserDataWithPasswordT} from "../types/user.types";
import {ApiError} from "../exceptions/api_errors";
import {SessionData} from "express-session";
import {PopularityRecommender} from "../recommenders/popularity_recommender";
import {ItemItemRecommender} from "../recommenders/cf_nb_item_item_recommender";
import {UserUserRecommender} from "../recommenders/cf_nb_user_user_recommender";

config()
const dao = getDAO(false);
class RecsService {


    async popularityRecommenderPops(userID:number, sessionUserID:number, take:number){


        const requestedUserID = userID || sessionUserID



        const recommender = new PopularityRecommender()

        return recommender.recommendItems(requestedUserID,take)
    }

    async popularityRecommenderBestsellers(userID:number, sessionUserID:number, take:number){
        const requestedUserID = userID || sessionUserID

        const recommender = new PopularityRecommender()

        return recommender.recommendBestSellers(requestedUserID,take)
    }

    async CFNBRecommenderItemItem(userID:number, sessionUserID:number, take:number){
        const requestedUserID = userID || sessionUserID

        const recommender = new ItemItemRecommender()

        return recommender.recommendItems(requestedUserID,take)
    }

    async CFNBRecommenderUserUser(userID:number, sessionUserID:number, take:number){
        const requestedUserID = userID || sessionUserID

        const recommender = new UserUserRecommender()

        return recommender.recommendItems(requestedUserID,take)
    }
}

const recsService = new RecsService()
export default recsService;