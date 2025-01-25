import {isEmail, isStrongPassword} from "validator";
import {BadRequestError} from "./errors";

export const validateSignUpData = (requestBody: Record<string, any>) => {
    const {email, password} = requestBody;

    if (!email) throw new BadRequestError("Email is required");
    if (!password) throw new BadRequestError("Password is required");

    if (!isEmail(email)) throw new BadRequestError("Email address is not valid");
    if (!isStrongPassword(password)) throw new BadRequestError("Please enter a strong password");
};

export const validateLoginData = (requestBody: Record<string, any>) => {
    const {email, password} = requestBody;

    if (!email) throw new BadRequestError("Email is required");
    if (!password) throw new BadRequestError("Password is required");

    if (!isEmail(email)) throw new BadRequestError("Email address is not valid");
};


export const validateTodoData = (requestBody: Record<string, any>) => {
    const {title, description, dueDate} = requestBody;

    if (!title) throw new BadRequestError("Title is required");
    if (!description) throw new BadRequestError("Description is required");
    if (!dueDate) throw new BadRequestError("DueDate is required");

    // Validate the dueDate format
    if (!dueDate || isNaN(Date.parse(dueDate))) throw new BadRequestError("Invalid dueDate format");

    const parsedDate = new Date(dueDate);

    // Ensure the dueDate is in the future
    if (parsedDate <= new Date()) throw new BadRequestError("dueDate must be in the future");
};

export const validateTodoUpdateData = (requestBody: Record<string, any>) => {
    const {dueDate} = requestBody;
    if (!dueDate) return;

    // Validate the dueDate format
    if (!dueDate || isNaN(Date.parse(dueDate))) throw new BadRequestError("Invalid dueDate format");

    const parsedDate = new Date(dueDate);

    // Ensure the dueDate is in the future
    if (parsedDate <= new Date()) throw new BadRequestError("dueDate must be in the future");
};
