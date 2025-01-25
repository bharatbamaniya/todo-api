import { StatusCodes } from "http-status-codes";

export class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(message, StatusCodes.NOT_FOUND);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

export class ApiError extends CustomError {
    constructor(message: string) {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
