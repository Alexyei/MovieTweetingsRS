import {NextFunction, Request, Response} from "express";
import {ApiError} from "../exceptions/api_errors";
import {getDAO} from "../DAO/DAO";

const dao = getDAO(false);
export default async function userIDExistValidator(req: Request, res:Response, next: NextFunction){
    const userID = Number(req.params.userID)
    const user = await dao.user.getUserByID(userID)
    if (user == null) next(ApiError.BadRequest(`Пользователь с id: ${userID} не найден`));

    next();
}