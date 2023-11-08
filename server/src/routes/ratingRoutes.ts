import {Router} from "express";
import authMiddleware from "../middlewares/auth_middleware";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import {rateValidation} from "../validators/rateValidation";
import ratingController from "../controllers/rating_contoller";
import adminMiddleware from "../middlewares/admin_middleware";
import userIDExistValidator from "../validators/URLParamsValidators";
import userController from "../controllers/user_controller";

export default function connectRatingRoutes(router: Router) {
    const prefix = '/rating'
    router.post(`${prefix}/rate`, authMiddleware,rateValidation, requestValidationMiddleware,  ratingController.rate);
    router.get(`${prefix}/distribution`, adminMiddleware, ratingController.distribution);
    router.get(`${prefix}/user-ratings/:userID`,adminMiddleware,userIDExistValidator,  ratingController.userRatings);
}