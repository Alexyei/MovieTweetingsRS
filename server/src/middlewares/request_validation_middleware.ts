import errorMiddleware from "./error_middleware";
import {ApiError} from "../exceptions/api_errors";
import {validationResult} from 'express-validator';
import {NextFunction, Request, Response} from "express";
export default async function  requestValidationMiddleware(req: Request, res: Response, next: NextFunction){


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorMiddleware(ApiError.BadRequest(errors.array()[0].msg), req, res, next)
    }
    next();


};