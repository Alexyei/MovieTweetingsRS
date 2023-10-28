import {body} from "express-validator";
import {getDAO} from "../DAO/DAO";
const dao = getDAO(false)
export const rateValidation = [
    body('movieID', 'ID фильма должен быть строкой').isString().custom(value => {
        return dao.movie.getMovieById(value).then(movie => {
            if (movie == null) {
                return Promise.reject(`Фильм с таким ID: ${value} не найден`);
            }
        });
    }),
    body('rating', 'Оценка должна быть в диапазоне от 1 до 10').isInt({ min: 1, max: 10 }),
];