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
}

const genreController = new GenreController()
export default genreController;