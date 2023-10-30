import {NextFunction, Request, Response} from "express";
import userService from "../services/user_service";

class UserController {
    async getUserFilms(req: Request, res: Response, next: NextFunction) {
        try {
            const sessionUserId = req.session.user!.id
            const movies = await userService.getUserFilms(sessionUserId);
            return res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }
}

const userController = new UserController()
export default userController;