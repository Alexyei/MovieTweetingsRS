import {body} from "express-validator";

export const userSearchValidation = [
    body('searchInput','Слишком длинный поисковый запрос').isLength({max:100}),
]

export const userIDsValidation = [
    body('userIDs', 'Передаваемые IDs должны быть массивом').isArray().custom(value => {
        for (let id of value){
            if ((typeof id) != 'number'){
                return Promise.reject(`ID: ${id} не является числом`);
            }
        }
        return true;
    }),
];