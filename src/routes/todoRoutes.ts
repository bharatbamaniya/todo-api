import express from 'express';
import {createTodo, deleteTodo, getTodo, getTodos, updateTodo} from '../controllers/todoController';
import {authMiddleware} from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
    .get(authMiddleware, getTodos)
    .post(authMiddleware, createTodo);

router.route('/:id')
    .get(authMiddleware, getTodo)
    .patch(authMiddleware, updateTodo)
    .delete(authMiddleware, deleteTodo);

export default router;