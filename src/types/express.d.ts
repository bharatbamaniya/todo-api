import * as express from 'express';
import {Request} from "express-serve-static-core";
import {IUserPayload} from "../middlewares/authMiddleware";

declare global {
    namespace Express {
        interface Request {
            user?: IUserPayload;
        }
    }
}

export interface IUserRequest extends Request {
    user?: IUserPayload;
}