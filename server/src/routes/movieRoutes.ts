import {Router} from "express";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import {movieIDsValidation} from "../validators/movieValidators";
import movieController from "../controllers/movie_controller";

export default function connectMovieRoutes(router: Router) {
    const prefix = '/movie'
    router.get(`${prefix}/movies`, movieIDsValidation, requestValidationMiddleware, movieController.movies);
    router.get(`${prefix}/movie/:movieID`, movieController.movie);
}