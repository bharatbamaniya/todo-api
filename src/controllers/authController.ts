import { Request, RequestHandler, Response } from "express-serve-static-core";
import { createUser, findUserByEmail } from "../services/authService";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import { CommonResponse } from "../utils/commonResponse";
import { validateLoginData, validateSignUpData } from "../utils/validation";
import asyncHandler from "../utils/asyncHandler";

export const register: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    validateSignUpData(req.body);
    const { email, password } = req.body;

    const isUserExitWithEmail = await findUserByEmail(email);

    if (isUserExitWithEmail) throw new BadRequestError("User already exist with email.");

    const createdUser = await createUser(email, password);
    const userData = createdUser.getUserWithoutSensitiveData();

    CommonResponse.success(res, userData, "User registered successfully");
});

export const login: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    validateLoginData(req.body);
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) throw new UnauthorizedError("Invalid credentials");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) throw new UnauthorizedError("Invalid credentials");

    const token = user.generateJwtToken();

    CommonResponse.success(res, {token}, "Logged in successfully");
});
