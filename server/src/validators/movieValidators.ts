import {getDAO} from "../DAO/DAO";
import {body} from "express-validator";

const dao = getDAO(false)
export const movieIDsValidation = [
    body('movieIDs', 'Передаваемые IDs должны быть массивом').isArray().custom(value => {
        for (let id of value){
            if ((typeof id) != 'string'){
                return Promise.reject(`ID: ${id} не является строкой`);
            }
        }
    }),
];