import {Router} from "express";
import requestValidationMiddleware from "../middlewares/request_validation_middleware";
import {movieIDsValidation, movieSearchValidation} from "../validators/movieValidators";
import movieController from "../controllers/movie_controller";
import adminMiddleware from "../middlewares/admin_middleware";
import {movieIDExistValidator} from "../validators/URLParamsValidators";

export default function connectMovieRoutes(router: Router) {
    const prefix = '/movie'
    router.post(`${prefix}/movies`, movieIDsValidation, requestValidationMiddleware, movieController.movies);
    router.get(`${prefix}/movie/:movieID`, movieController.movie);
    router.post(`${prefix}/search`, movieSearchValidation, requestValidationMiddleware, movieController.search)
    router.get(`${prefix}/movie-similarities/:movieID`,adminMiddleware,movieIDExistValidator, movieController.similaritiesForMovie);
}