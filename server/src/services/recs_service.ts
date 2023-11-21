import {config} from "dotenv";
import {getDAO} from "../DAO/DAO";
import {PopularityRecommender} from "../recommenders/popularity_recommender";
import {ItemItemRecommender} from "../recommenders/cf_nb_item_item_recommender";
import {UserUserRecommender} from "../recommenders/cf_nb_user_user_recommender";
import { AssociationRuleRecommender } from "../recommenders/association_rules_recommender";

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

        const recommender = new ItemItemRecommender(false)

        return recommender.recommendItems(requestedUserID,take,2,100,0)
    }

    async CFNBRecommenderUserUser(userID:number, sessionUserID:number, take:number){
        const requestedUserID = userID || sessionUserID

        const recommender = new UserUserRecommender(false)

        return recommender.recommendItems(requestedUserID,take,2,100,0.1)
    }

    async associationRules(movieID:string, take:number|undefined){

        const recommender = new AssociationRuleRecommender()

        return recommender.recommendItems(movieID,take)
    }
}

const recsService = new RecsService()
export default recsService;