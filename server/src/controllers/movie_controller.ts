import {NextFunction, Request, Response} from "express";
import authService from "../services/auth_service";
import movieService from "../services/movie_service";

class MovieController {
    async movies(req: Request, res: Response, next: NextFunction) {
        try {
            const {movieIDs} = req.body;
            const movies = await movieService.movies(movieIDs);
            return res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }

    async movie(req: Request, res: Response, next: NextFunction) {
        try {

            const requestMovieId = req.params.movieID
            const movie = await movieService.movie(requestMovieId)

            return res.status(200).json(movie);
        } catch (error) {
            next(error);
        }
    }
}

const movieController = new MovieController()
export default movieController;