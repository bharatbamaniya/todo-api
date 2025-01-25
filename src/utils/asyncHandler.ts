import { ErrorRequestHandler, NextFunction, Request, Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "./errors";
import { CommonResponse } from "./commonResponse";

export const globalErrorHandler: ErrorRequestHandler = (error, req: Request, res: Response, next: NextFunction) => {
    error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = error.status || false;
    CommonResponse.error(res, error.statusCode, "Internal Server Error");
};

const asyncHandler = (requestHandler: (req: Request, res: Response) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        requestHandler(req, res).catch((error) => {
            if (error instanceof CustomError) {
                CommonResponse.error(res, error.statusCode, error.message);
            } else {
                console.error(error);
                CommonResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
            }
        });
    };
};

export default asyncHandler;
