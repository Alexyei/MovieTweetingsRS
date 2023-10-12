import bcrypt from "bcrypt";
import {config} from "dotenv";
import {getDAO} from "../DAO/DAO";
import {UserRole} from "@prisma/client";
import {UserDataT, UserDataWithPasswordT} from "../types/user.types";
import {ApiError} from "../exceptions/api_errors";
import {SessionData} from "express-session";
config()
const dao = getDAO(false);
class AuthService {
    async registration(email:string, login:string, password:string) {
        const hashPassword = await bcrypt.hash(password, Number(process.env['SALT_ROUNDS']) ||3);

        const user= await dao.user.saveOne({email, login, password:hashPassword,role:UserRole.USER})

        return user;
    }

    async login(login:string, password:string) {
        const user = await dao.user.getUserByLogin(login, true) as UserDataWithPasswordT

        const isPassEquals = await bcrypt.compare(password, user.password!);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный email или пароль');
        }
        const {password:_,...userData} = user
        return userData;
    }

    async getUserData(userID:number, sessionUserID:number){

        const user = await dao.user.getUserByID(userID) as UserDataT
        if (user.role !== UserRole.ADMIN || userID != sessionUserID) {
            throw ApiError.Forbidden()
        }

        return user;
    }

    async logout(userId:number,sessionUserId:number,sessionStore:Express.SessionStore){
        const user = await dao.user.getUserByID(userId) as UserDataT
        if (user.role !== UserRole.ADMIN || userId != sessionUserId) {
            throw ApiError.Forbidden()
        }
        //удаляем только текущую сессию
        // req.session.destroy((err) => {
        //     res.redirect(config.app.client_url) // will always fire after session is destroyed
        // })
        //удаляем все сессии пользователя
        if (sessionStore != undefined){
            // @ts-ignore
            sessionStore.all((error, sessions) => {
                if (error) {
                    // Обработка ошибки
                    throw new Error('Ошибка получения сессий',error)
                } else {
                    if (!sessions) return;
                    // Проходимся по каждой сессии
                    (sessions as SessionData[]).forEach(session  => {
                        // Проверяем, сессия принадлежит ли пользователю с указанным id
                        if (session.user.id === userId) {
                            // Удаляем сессию из Redis
                            sessionStore.destroy(session.user.id.toString(), (error) => {
                                if (error) {
                                    // Обработка ошибки
                                    throw new Error('Ошибка удаления сессии:', error)
                                }
                            });
                        }
                    });
                }})
        }

    }
}

const authService = new AuthService()
export default authService;