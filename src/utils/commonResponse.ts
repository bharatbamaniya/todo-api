import { Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";

export class CommonResponse {
    static success<T>(res: Response, data: T, message?: string) {
        res.status(StatusCodes.OK).json({
            success: true,
            message: message || "Success",
            data,
        });
    }

    static error(res: Response, statusCode: number, message: string) {
        res.status(statusCode).json({
            success: false,
            message,
        });
    }
}
