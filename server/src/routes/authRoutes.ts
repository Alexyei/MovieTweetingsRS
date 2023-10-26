import {Router} from "express";
import {loginValidation, registerValidation} from "../validators/authValidators";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import authMiddleware from "../middlewares/auth_middleware";
import authController from "../controllers/auth_controller";
import adminMiddleware from "../middlewares/admin_middleware";
import userIDExistValidator from "../validators/URLParamsValidators";

export default function connectAuthRoutes(router: Router) {
    const prefix = '/auth'
    router.post(`${prefix}/login`, loginValidation, requestValidationMiddleware, authController.login);
    router.post(`${prefix}/signup`, registerValidation, requestValidationMiddleware, authController.registration);
    router.get(`${prefix}/data/`, authMiddleware, authController.getUserData);
    router.delete(`${prefix}/logout/`, authMiddleware, authController.logout);


    router.get(`${prefix}/data/:userID`, adminMiddleware,userIDExistValidator, authController.getUserData);
    router.delete(`${prefix}/logout/:userID`, adminMiddleware,userIDExistValidator, authController.logout);

}