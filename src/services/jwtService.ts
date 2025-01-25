import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { ApiError } from "../utils/errors";
import { config } from "dotenv";
config();

export const generateToken = (payload: Record<string, any>) => {
    const secret: jwt.Secret = process.env.JWT_SECRET as string;
    const expiresIn: StringValue = (process.env.JWT_EXPIRY || "1d") as StringValue;
    const options: jwt.SignOptions = { expiresIn };

    return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string) => {
    if (!token) throw new ApiError("Token not found to verify");

    return jwt.verify(token, process.env.JWT_SECRET as string);
};
