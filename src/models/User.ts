import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import {generateToken} from "../services/jwtService";

interface IUser extends Document {
    email: string;
    password: string;

    isPasswordCorrect(password: string): Promise<boolean>;

    generateJwtToken(): string;

    getUserWithoutSensitiveData(): Omit<IUser, "password">;
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
}, {timestamps: true});

userSchema.methods.isPasswordCorrect = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateJwtToken = function (): string {
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
    };

    return generateToken(payload);
};

userSchema.methods.getUserWithoutSensitiveData = function () {
    const object = this.toObject();
    delete object.password;

    return object;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
