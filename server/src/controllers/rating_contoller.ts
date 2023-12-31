import {NextFunction, Request, Response} from "express";
import ratingService from "../services/rating_service";

class RatingController {
    async rate(req: Request, res: Response, next: NextFunction) {
        try {
            const {rating, movieID} = req.body;
            const sessionUserId = req.session.user!.id
            await ratingService.rate(sessionUserId,movieID,rating);

            return res.status(200).json("success");
        } catch (e) {
            next(e);
        }
    }

    async distribution(req: Request, res: Response, next: NextFunction) {
        try {

            const distribution = await ratingService.getRatingsDistribution();

            return res.status(200).json(distribution);
        } catch (e) {
            next(e);
        }
    }

    async userRatings(req: Request, res: Response, next: NextFunction) {
        try {

            const requestUserId = Number(req.params.userID)
            const ratings = await ratingService.userRatings(requestUserId);

            return res.status(200).json(ratings);
        } catch (e) {
            next(e);
        }
    }
}

const ratingController = new RatingController()
export default ratingController;