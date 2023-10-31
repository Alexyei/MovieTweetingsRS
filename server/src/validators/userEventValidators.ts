import {body} from "express-validator";

export const createUserEventValidation = [
    body('genreID').custom((value, {req }) => {
        if (value != null && typeof req.body['genreID'] != 'number') {
            throw new Error('ID категории должен быть числом или null')
        }
        return true
    }),
    body('movieID', ).custom((value, {req }) => {
        if (value != null && typeof req.body['movieID'] != 'string') {
            throw new Error('ID фильма должен быть строкой или null')
        }

        if (value == null && req.body['genreID'] == null) {
            throw new Error('Должен быть передан только один из двух: (movieID, genreID)');
        }

        if (value != null && req.body['genreID'] != null) {
            throw new Error('Должен быть передан только один из двух: (movieID, genreID)');
        }
        return true;
    }),
    body('type', 'Оценка должна быть в диапазоне от 1 до 10').isIn(["DETAILS" , "MORE_DETAILS" , "ADD_TO_FAVORITES_LIST" , "BUY" , "REMOVE_FROM_FAVORITES_LIST","GENRE_VIEW"]).custom((value, {req }) => {
        if (value == "GENRE_VIEW" && req.body['genreID'] == null){
            throw new Error('Событие "GENRE_VIEW" недопустимо для фильма');
        }
        if (value != "GENRE_VIEW" && req.body['genreID'] != null){
            throw new Error('Для жанра допустимо только "GENRE_VIEW" событие');
        }
        return true;
    }),
];