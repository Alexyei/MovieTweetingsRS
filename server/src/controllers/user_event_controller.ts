import {NextFunction, Request, Response} from "express";
import genreService from "../services/genre_service";
import userEventService from "../services/user_event_service";

class UserEventController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {movieID,genreID,type} = req.body;
            const sessionUserId = req.session.user!.id
            const sessionId = req.session.id
            await userEventService.create(sessionUserId,movieID,genreID,type,sessionId);
            return res.status(200).json("success");
        } catch (error) {
            next(error);
        }
    }

    async eventsCount(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await userEventService.eventsCount()
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    async purchasesInfo(req: Request, res: Response, next: NextFunction){
        try {
            const data = await userEventService.purchasesInfo()
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    async bestsellers(req: Request, res: Response, next: NextFunction){
        try {
            const data = await userEventService.bestsellers()
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
    async recentPurchases(req: Request, res: Response, next: NextFunction){
        try {
            const data = await userEventService.recentPurchases(100)
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }



    async purchasesForMovie(req: Request, res: Response, next: NextFunction){
        try {
            const movieId = req.params.movieID
            const data = await userEventService.getPurchasesForMovie(movieId)
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    async resentUserEvents(req: Request, res: Response, next: NextFunction){
        try {
            const userId = Number(req.params.userID)
            const data = await userEventService.getRecentUserEvents(userId,100)
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
}

const userEventController = new UserEventController()
export default userEventController;