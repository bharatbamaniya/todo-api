import { isEmail, isStrongPassword } from "validator";
import { BadRequestError } from "./errors";

export const validateSignUpData = (requestBody: Record<string, any>) => {
  const { email, password } = requestBody;

  if (!email) throw new BadRequestError("Email is required");
  if (!password) throw new BadRequestError("Password is required");

  if (!isEmail(email)) throw new BadRequestError("Email address is not valid");
  if (!isStrongPassword(password)) throw new BadRequestError("Please enter a strong password");
};

export const validateLoginData = (requestBody: Record<string, any>) => {
  const { email, password } = requestBody;

  if (!email) throw new BadRequestError("Email is required");
  if (!password) throw new BadRequestError("Password is required");

  if (!isEmail(email)) throw new BadRequestError("Email address is not valid");
};
