import {Router} from "express";
import adminMiddleware from "../middlewares/admin_middleware";
import authMiddleware from "../middlewares/auth_middleware";
import userIDExistValidator, { movieIDExistValidator } from "../validators/URLParamsValidators";
import recsController from "../controllers/recs_controller";

export default function connectRecommendRoutes(router: Router) {
    const prefix = '/rec'
    //?take=10
    router.get(`${prefix}/association-rules/:movieID`,movieIDExistValidator, recsController.associationRules);
    router.get(`${prefix}/pop/pops`, authMiddleware,  recsController.popularityRecommenderPops);
    router.get(`${prefix}/pop/bestsellers`, authMiddleware,  recsController.popularityRecommenderBestsellers);
    router.get(`${prefix}/cf/nb/item-item`, authMiddleware,  recsController.CFNBRecommenderItemItem);
    router.get(`${prefix}/cf/nb/user-user`, authMiddleware,  recsController.CFNBRecommenderUserUser);

    router.get(`${prefix}/pop/pops/:userID`, adminMiddleware,userIDExistValidator,  recsController.popularityRecommenderPops);
    router.get(`${prefix}/pop/bestsellers/:userID`, adminMiddleware,userIDExistValidator,  recsController.popularityRecommenderBestsellers);
    router.get(`${prefix}/cf/nb/item-item/:userID`, adminMiddleware,userIDExistValidator,  recsController.CFNBRecommenderItemItem);
    router.get(`${prefix}/cf/nb/user-user/:userID`, adminMiddleware,userIDExistValidator,  recsController.CFNBRecommenderUserUser);
    
}