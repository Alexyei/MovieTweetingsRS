import {NextFunction, Request, Response} from "express"
import {ApiError} from "../exceptions/api_errors";
export default function authMiddleware(req: Request, res:Response, next: NextFunction) {
    if (!req.session || !req.session.user) {
        next(ApiError.Unauthorized());
    }
    next();
}