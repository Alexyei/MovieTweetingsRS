import {Router} from "express";
import userController from "../controllers/user_controller";
import authMiddleware from "../middlewares/auth_middleware";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import {userSearchValidation} from "../validators/userValidators";

export default function connectUserRoutes(router: Router) {
    const prefix = '/user'
    router.get(`${prefix}/films`,authMiddleware,  userController.getUserFilms);
    router.post(`${prefix}/search`, userSearchValidation, requestValidationMiddleware, userController.search)
}