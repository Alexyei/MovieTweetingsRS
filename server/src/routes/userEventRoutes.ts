import {Router} from "express";
import genreController from "../controllers/genre_controller";
import authMiddleware from "../middlewares/auth_middleware";
import {createUserEventValidation} from "../validators/userEventValidators";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import userEventController from "../controllers/user_event_controller";

export default function connectUserEventRoutes(router: Router) {
    const prefix = '/log'
    router.post(`${prefix}/create`, authMiddleware,createUserEventValidation,requestValidationMiddleware,  userEventController.create);
}