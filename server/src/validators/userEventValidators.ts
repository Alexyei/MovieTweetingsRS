import {body} from "express-validator";

export const createUserEventValidation = [
    body('genreID', 'ID фильма должен быть строкой или null').optional().isString(),
    body('movieID', 'ID фильма должен быть строкой или null').optional().isString().custom((value, {req }) => {
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