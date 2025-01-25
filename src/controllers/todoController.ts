import { RequestHandler, Response } from "express-serve-static-core";
import { IUserRequest } from "../types/express";
import asyncHandler from "../utils/asyncHandler";
import { validateTodoData, validateTodoUpdateData } from "../utils/validation";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import { CommonResponse } from "../utils/commonResponse";
import todoService from "../services/todoService";
import {StatusCodes} from "http-status-codes";

export const createTodo: RequestHandler = asyncHandler(async (req: IUserRequest, res: Response): Promise<any> => {
    validateTodoData(req.body);

    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedError("UserId not found the the request");

    const { title, description, dueDate } = req.body;
    const parsedDate = new Date(dueDate);

    const todo = await todoService.createTodo(title, description, parsedDate, userId);

    CommonResponse.success(res, todo, "Todo created successfully", StatusCodes.CREATED);
});

export const getTodo: RequestHandler = asyncHandler(async (req: IUserRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedError("UserId not found the the request");

    let todo = await todoService.findTodoByIdAndUserId(id, userId);
    if (!todo) throw new NotFoundError("Todo not found");

    CommonResponse.success(res, todo, "Data fetched successfully");
});

export const getTodos: RequestHandler = asyncHandler(async (req: IUserRequest, res: Response): Promise<any> => {
    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedError("UserId not found the the request");

    const todo = await todoService.getTodos(userId);
    CommonResponse.success(res, todo, "Data fetched successfully");
});

export const updateTodo: RequestHandler = asyncHandler(async (req: IUserRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    validateTodoUpdateData(req.body);

    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedError("UserId not found the the request");

    const todo = await todoService.findTodoById(id);
    if (!todo) throw new NotFoundError("Todo not found");

    if (todo.user.toString() !== userId) throw new UnauthorizedError("You are not authorized to update it");

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.dueDate = dueDate || todo.dueDate;
    todo.completed = completed ?? todo.completed;

    await todo.save();
    CommonResponse.success(res, todo, "Todo updated successfully");
});

export const deleteTodo: RequestHandler = asyncHandler(async (req: IUserRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedError("UserId not found the the request");

    const todo = await todoService.findTodoById(id);
    if (!todo) throw new NotFoundError("Todo not found");

    if (todo.user.toString() !== userId) throw new UnauthorizedError("You are not authorized to delete it");

    const result = await todoService.deleteTodo(id, userId);

    if (result.deletedCount === 0) throw new NotFoundError("Todo not found or you are not authorized to delete it");

    CommonResponse.success(res, null, "Todo deleted successfully");
});
