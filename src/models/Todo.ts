import mongoose, { Schema, Document } from 'mongoose';

interface ITodo extends Document {
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    user: mongoose.Types.ObjectId;
}

const todoSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
        required: true,
        validate: [
            function (value: Date) {
                return value >= new Date(); // Ensure dueDate is in the future
            },
            'Due date must be in the future',
        ]
    },
    completed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {timestamps: true});

const Todo = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo;