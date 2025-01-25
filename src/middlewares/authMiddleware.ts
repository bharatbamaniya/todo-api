import { NextFunction, Request, Response } from "express";
import { CommonResponse } from "../utils/commonResponse";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../services/jwtService";

export interface IUserPayload {
    _id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // remove Bearer from the auth token

        if (!token) return CommonResponse.error(res, StatusCodes.UNAUTHORIZED, "Unauthorized");

        const decoded = verifyToken(token) as IUserPayload;
        req.user = { _id: decoded._id };
        next();
    } catch (error) {
        return CommonResponse.error(res, StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
};
