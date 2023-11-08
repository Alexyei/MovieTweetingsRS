import {Router} from "express";
import userController from "../controllers/user_controller";
import authMiddleware from "../middlewares/auth_middleware";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import {userIDsValidation, userSearchValidation} from "../validators/userValidators";
import adminMiddleware from "../middlewares/admin_middleware";

export default function connectUserRoutes(router: Router) {
    const prefix = '/user'
    router.get(`${prefix}/films`,authMiddleware,  userController.getUserFilms);
    router.post(`${prefix}/search`, userSearchValidation, requestValidationMiddleware, userController.search)
    router.post(`${prefix}/users`, adminMiddleware,userIDsValidation, requestValidationMiddleware, userController.usersData)
}