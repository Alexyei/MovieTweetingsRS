import {Router} from "express";
import genreController from "../controllers/genre_controller";

export default function connectGenreRoutes(router: Router) {
    const prefix = '/genre'
    router.get(`${prefix}/genres`,  genreController.genres);
    router.get(`${prefix}/data/:name`,  genreController.genreData);

}