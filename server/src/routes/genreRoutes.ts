import {Router} from "express";
import genreController from "../controllers/genre_controller";
import adminMiddleware from "../middlewares/admin_middleware";
import userIDExistValidator from "../validators/URLParamsValidators";

export default function connectGenreRoutes(router: Router) {
    const prefix = '/genre'
    router.get(`${prefix}/genres`,  genreController.genres);
    router.get(`${prefix}/all`,  genreController.all);
    router.get(`${prefix}/data/:name`,  genreController.genreData);
    router.get(`${prefix}/user-ratings-data/:userID`,adminMiddleware,userIDExistValidator,  genreController.userRatingsDataByGenres);
    router.get(`${prefix}/user-genres-count/:userID`,adminMiddleware,userIDExistValidator,  genreController.userGenresCount);

}