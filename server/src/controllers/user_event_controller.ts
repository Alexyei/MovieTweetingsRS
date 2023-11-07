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
}

const userEventController = new UserEventController()
export default userEventController;