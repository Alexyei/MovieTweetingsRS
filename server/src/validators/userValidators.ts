import {body} from "express-validator";

export const userSearchValidation = [
    body('searchInput','Слишком длинный поисковый запрос').isLength({max:100}),
]