import Todo from "../models/Todo";
import mongoose from "mongoose";
import { ApiError } from "../utils/errors";

const isInvalidObjectId = (_id: string) => !mongoose.isObjectIdOrHexString(_id);

const createTodo = (title: string, description: string, dueDate: Date, userId: string) => {
    return Todo.create({ title, description, dueDate, user: userId });
};

const findTodoByIdAndUserId = (_id: string, userId: string) => {
    if (isInvalidObjectId(_id) || isInvalidObjectId(userId)) throw new ApiError("Invalid objectId");

    return Todo.findById({ _id });
};

const findTodoById = (_id: string) => {
    if (isInvalidObjectId(_id)) throw new ApiError("Invalid objectId");

    return Todo.findById({ _id });
};

const getTodos = (userId: string) => {
    if (isInvalidObjectId(userId)) throw new ApiError("Invalid objectId");

    return Todo.find({ user: userId });
};

const deleteTodo = (_id: string, userId: string) => {
    if (isInvalidObjectId(_id) || isInvalidObjectId(userId)) throw new ApiError("Invalid objectId");

    return Todo.deleteOne({ _id, user: userId });
};

const updateExpiredTodos = async () => {
    try {
        const now = new Date();
        await Todo.updateMany(
            {
                dueDate: {$lt: now},
                completed: false
            },
            {
                $set: {completed: true}
            }
        );
    } catch (error) {
        console.error('Error updating expired todos:', error);
        throw error;
    }
}

export default {
    createTodo,
    getTodos,
    findTodoByIdAndUserId,
    findTodoById,
    deleteTodo,
    updateExpiredTodos
};
