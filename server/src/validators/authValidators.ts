import {body} from "express-validator";
import {getDAO} from "../DAO/DAO";

const dao = getDAO(false)
export const loginValidation = [
    body('login', 'Логин должен быть от 3 до 16 символов').isLength({ min: 3,max:16 }).custom(value => {
        return dao.user.getUserByLogin(value).then(user => {
            if (user == null) {
                return Promise.reject(`Пользователь с таким login: ${value} не найден`);
            }
        });
    }),
    body('password', 'Пароль должен быть от 5 до 32 символов').isLength({ min: 5,max:32 }),
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail().custom((value) => {
        return dao.user.getUserByEmail(value).then(user => {
            if (user !== null) {
                return Promise.reject(`E-mail: ${value} уже используется`);
            }
        });
    }),
    body('password', 'Пароль должен быть от 5 до 32 символов').isLength({ min: 5,max:32 }),
    body('confirmPassword').custom((value, {req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают');
        }
        return true;
    }),
    body('login', 'Логин должен быть от 3 до 16 символов').isLength({ min: 3,max:16 }).custom(value => {
        return dao.user.getUserByLogin(value).then(user => {
            if (user !== null) {
                return Promise.reject(`login: ${value} уже используется`);
            }
        });
    }),
];