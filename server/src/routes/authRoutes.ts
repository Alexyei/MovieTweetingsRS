import {Router} from "express";
import {loginValidation, registerValidation} from "../validators/authValidators";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import authMiddleware from "../middlewares/auth_middleware";
import authController from "../controllers/auth_controller";

export default function connectAuthRoutes(router: Router) {
    const prefix = '/auth'
    router.post(`${prefix}/login`, loginValidation, requestValidationMiddleware, authController.login);
    router.post(`${prefix}/signup`, registerValidation, requestValidationMiddleware, authController.registration);
    router.get(`${prefix}/:userID`, authMiddleware, authController.getUserData);
    router.delete(`${prefix}/:userID`, authMiddleware, authController.logout);
}