import { Document, Types } from "mongoose"
import { Request } from "express";

export interface UserInterface extends Document{
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role?: string;
}

export interface QuestionInterface extends Document {
    _id: Types.ObjectId;
    question: string;
    options: string[];
    correctOptionIndex: number;
    difficultyRating: number;
}

export interface ResultInterface extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    quizId: Types.ObjectId;
    score: number;
}

export interface QuizInterface extends Document {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    questions: QuestionInterface[];
    quizNumber: number;
}

export interface CustomRequest extends Request {
    user: {
        userId: string;
        username: string;
        role?: string
    }
}
