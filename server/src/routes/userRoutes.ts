import {Router} from "express";
import userController from "../controllers/user_controller";
import authMiddleware from "../middlewares/auth_middleware";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import {userIDsValidation, userSearchValidation} from "../validators/userValidators";
import adminMiddleware from "../middlewares/admin_middleware";
import userIDExistValidator, {movieIDExistValidator} from "../validators/URLParamsValidators";
import movieController from "../controllers/movie_controller";

export default function connectUserRoutes(router: Router) {
    const prefix = '/user'
    router.get(`${prefix}/films`,authMiddleware,  userController.getUserFilms);

    router.post(`${prefix}/search`, adminMiddleware, userSearchValidation, requestValidationMiddleware, userController.search)
    router.post(`${prefix}/users`, adminMiddleware,userIDsValidation, requestValidationMiddleware, userController.usersData)
    router.get(`${prefix}/user-similarities/:userID`,adminMiddleware,userIDExistValidator, userController.similaritiesForUser);
    router.get(`${prefix}/films/:userID`,adminMiddleware,userIDExistValidator,  userController.getUserFilms);
}