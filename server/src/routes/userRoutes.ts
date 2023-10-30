import {Router} from "express";
import userController from "../controllers/user_controller";
import authMiddleware from "../middlewares/auth_middleware";

export default function connectUserRoutes(router: Router) {
    const prefix = '/user'
    router.get(`${prefix}/films`,authMiddleware,  userController.getUserFilms);

}