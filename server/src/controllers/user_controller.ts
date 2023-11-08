import {NextFunction, Request, Response} from "express";
import userService from "../services/user_service";


class UserController {
    async getUserFilms(req: Request, res: Response, next: NextFunction) {
        try {
            const requestUserId = Number(req.params.userID)
            const sessionUserId = req.session.user!.id
            const movies = await userService.getUserFilms(requestUserId,sessionUserId);
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

    async similaritiesForUser(req: Request, res: Response, next: NextFunction) {
        try {

            const requestUserId = Number(req.params.userID)
            const userSims = await userService.getUserSimilarities(requestUserId)

            return res.status(200).json(userSims);
        } catch (error) {
            next(error);
        }
    }
}

const userController = new UserController()
export default userController;