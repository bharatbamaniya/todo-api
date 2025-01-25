import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

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
});

userSchema.methods.isPasswordCorrect = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateJwtToken = function (): string {
    const secret: jwt.Secret = process.env.JWT_TOKEN_SECRET || "secret";
    const expiresIn: StringValue = (process.env.JWT_TOKEN_EXPIRY || "1d") as StringValue;
    const options: jwt.SignOptions = { expiresIn };

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        secret,
        options
    );
};

userSchema.methods.getUserWithoutSensitiveData = function () {
    const object = this.toObject();
    delete object.password;

    return object;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
