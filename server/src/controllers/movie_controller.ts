import {NextFunction, Request, Response} from "express";
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

    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const {searchRequest, yearFrom,yearTo,genreIDs,ordering,take,skip} = req.body;
            const movies = await movieService.search(searchRequest, yearFrom,yearTo,genreIDs,ordering,take,skip);
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

    async similaritiesForMovie(req: Request, res: Response, next: NextFunction) {
        try {

            const requestMovieId = req.params.movieID
            const movieSims = await movieService.getMovieSimilarities(requestMovieId)

            return res.status(200).json(movieSims);
        } catch (error) {
            next(error);
        }
    }
}

const movieController = new MovieController()
export default movieController;