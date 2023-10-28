import {Router} from "express";
import authMiddleware from "../middlewares/auth_middleware";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import {rateValidation} from "../validators/rateValidation";
import ratingController from "../controllers/rating_contoller";

export default function connectRatingRoutes(router: Router) {
    const prefix = '/rating'
    router.get(`${prefix}/rate`, authMiddleware,rateValidation, requestValidationMiddleware,  ratingController.rate);
}