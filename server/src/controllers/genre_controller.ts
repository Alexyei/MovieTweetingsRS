import {NextFunction, Request, Response} from "express";
import genreService from "../services/genre_service";

class GenreController {
    async genres(req: Request, res: Response, next: NextFunction) {
        try {
            const genres = await genreService.genres();
            return res.status(200).json(genres);
        } catch (error) {
            next(error);
        }
    }

    async genreData(req: Request, res: Response, next: NextFunction) {
        try {
            const genreName = req.params.name
            const genreData = await genreService.genreData(genreName)
            return res.status(200).json(genreData);
        } catch (error) {
            next(error);
        }
    }

    async userRatingsDataByGenres(req: Request, res: Response, next: NextFunction) {
        try {
            const requestUserId = Number(req.params.userID)
            const genreData = await genreService.userRatingsDataByGenres(requestUserId)
            return res.status(200).json(genreData);
        } catch (error) {
            next(error);
        }
    }
}

const genreController = new GenreController()
export default genreController;