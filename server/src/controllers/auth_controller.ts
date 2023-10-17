import {NextFunction, Request, Response} from "express";
import authService from "../services/auth_service";
class AuthController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {

            const {email, login, password} = req.body;
            const userData = await authService.registration(email, login, password);
            req.session.user = userData
            return res.status(201).json(userData);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {

            const {login, password} = req.body;
            const userData = await authService.login(login, password);
            req.session.user = userData
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUserData(req: Request, res: Response, next: NextFunction) {
        try {
            const requestUserId = Number(req.params.userID)

            const sessionUserId = req.session.user!.id
            const userData = await authService.getUserData(requestUserId,sessionUserId);

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const requestUserId = Number(req.params.userID)
            const sessionUserId = req.session.user!.id

            await authService.logout(requestUserId,sessionUserId,req.sessionStore);

            return res.status(200).json("");
        } catch (e) {
            next(e);
        }
    }
}

const authController = new AuthController()
export default authController;