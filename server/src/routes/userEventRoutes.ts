import {Router} from "express";
import authMiddleware from "../middlewares/auth_middleware";
import {createUserEventValidation} from "../validators/userEventValidators";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import userEventController from "../controllers/user_event_controller";
import adminMiddleware from "../middlewares/admin_middleware";
import userIDExistValidator, {movieIDExistValidator} from "../validators/URLParamsValidators";

export default function connectUserEventRoutes(router: Router) {
    const prefix = '/log'
    router.post(`${prefix}/create`, authMiddleware,createUserEventValidation,requestValidationMiddleware,  userEventController.create);
    router.get(`${prefix}/events-count`, adminMiddleware,  userEventController.eventsCount);
    router.get(`${prefix}/purchases-info`, adminMiddleware,  userEventController.purchasesInfo);
    router.get(`${prefix}/bestsellers`, adminMiddleware,  userEventController.bestsellers);
    router.get(`${prefix}/recent-purchases`, adminMiddleware,  userEventController.recentPurchases);
    router.get(`${prefix}/purchases/:movieID`,adminMiddleware,movieIDExistValidator,  userEventController.purchasesForMovie)
    router.get(`${prefix}/recent-user-events/:userID`,adminMiddleware,userIDExistValidator,  userEventController.resentUserEvents)
}