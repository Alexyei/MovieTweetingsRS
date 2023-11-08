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

    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const {searchInput} = req.body;
            const users = await userService.searchUsers(searchInput);
            return res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async usersData(req: Request, res: Response, next: NextFunction) {
        try {
            const {userIDs} = req.body;
            const users = await userService.getUsersData(userIDs);
            return res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
}

const userController = new UserController()
export default userController;