import {getDAO} from "../DAO/DAO";
import {body} from "express-validator";
import {MovieOrderingT} from "../types/movie.types";

const dao = getDAO(false)
export const movieIDsValidation = [
    body('movieIDs', 'Передаваемые IDs должны быть массивом').isArray().custom(value => {
        for (let id of value){
            if ((typeof id) != 'string'){
                return Promise.reject(`ID: ${id} не является строкой`);
            }
        }
        return true;
    }),
];

export const movieSearchValidation = [
    body('yearFrom','Год начала поиска должен быть числом').isInt(),
    body('yearTo','Год окончания поиска должен быть числом').isInt(),
    body('take','take должен быть числом').isInt(),
    body('skip','take должен быть числом').isInt(),
    body('searchRequest','Слишком длинный поисковый запрос').isLength({max:100}),
    body('ordering', 'Недопустимый вариант сортировки').isIn(["year asc" , "year desc" , "title asc" , "title desc"] as MovieOrderingT[]),
    body('genreIDs', 'Передаваемые IDs должны быть массивом').isArray().custom(value => {
        for (let id of value){
            if ((typeof id) != 'number'){
                return Promise.reject(`ID: ${id} не является числом`);
            }
        }
        return true;
    }),
]