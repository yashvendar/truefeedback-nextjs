import mongoose, {Schema, Document } from "mongoose";

// required for type defination of Schema
export interface Message extends Document{
    content: string;
    createdAt: Date
}
const MessageSchema:Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})
export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    isVerified: boolean;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    messages: Message[];
}
const UserSchema:Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        match: [/.+\@.+\..+/,"Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "verifyCode is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verifyCodeExpiry is required"],
        default: Date.now
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: {
        type:[MessageSchema],
        required: true,
        default: []
    }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User', UserSchema));
export default UserModel;