import {NextFunction, Request, Response} from "express";
import authService from "../services/auth_service";
import recsService from "../services/recs_service";
class RecsController {


    async popularityRecommenderPops(req: Request, res: Response, next: NextFunction) {
        try {
            const take = Number(req.query.take) || 10

            const requestUserId = Number(req.params.userID)
            const sessionUserId = req.session.user!.id
            const recs = await recsService.popularityRecommenderPops(requestUserId,sessionUserId,take);

            return res.json(recs);
        } catch (e) {
            next(e);
        }
    }

    async popularityRecommenderBestsellers(req: Request, res: Response, next: NextFunction) {
        try {
            const take = Number(req.query.take) || 10

            const requestUserId = Number(req.params.userID)
            const sessionUserId = req.session.user!.id
            const recs = await recsService.popularityRecommenderBestsellers(requestUserId,sessionUserId,take);

            return res.json(recs);
        } catch (e) {
            next(e);
        }
    }

    async CFNBRecommenderItemItem(req: Request, res: Response, next: NextFunction) {
        try {
            const take = Number(req.query.take) || 10

            const requestUserId = Number(req.params.userID)
            const sessionUserId = req.session.user!.id
            const recs = await recsService.CFNBRecommenderItemItem(requestUserId,sessionUserId,take);

            return res.json(recs);
        } catch (e) {
            next(e);
        }
    }

    async CFNBRecommenderUserUser(req: Request, res: Response, next: NextFunction) {
        try {
            const take = Number(req.query.take) || 10

            const requestUserId = Number(req.params.userID)
            const sessionUserId = req.session.user!.id
            const recs = await recsService.CFNBRecommenderUserUser(requestUserId,sessionUserId,take);

            return res.json(recs);
        } catch (e) {
            next(e);
        }
    }
}

const recsController = new RecsController()
export default recsController;