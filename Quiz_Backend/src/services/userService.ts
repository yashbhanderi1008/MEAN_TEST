import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserInterface } from "../interfaces/interface";
import User from "../model/userModel";
import { SECRET_KEY } from '../config/config';
import { Types } from 'mongoose';
import Quiz from '../model/quizModel';

export class UserServices {
    static async createUser(user: UserInterface): Promise<void> {
        const userExist: UserInterface | null = await User.findOne({ email: user.email });

        if (userExist) {
            throw new Error(`You are already Registered`);
        }

        const newUser = new User(user);

        newUser.password = await bcrypt.hash(newUser.password, 10);
        await newUser.save();
    }

    static async login(email: string, password: string): Promise<string> {
        const user: UserInterface | null = await User.findOne({ email: email });

        if (!user) {
            throw new Error(`User not found`);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid Credentials");
        }

        const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, `${SECRET_KEY}`, { algorithm: 'HS256' });

        return token;
    }

    static async updateUser(user: UserInterface, userId: string): Promise<void> {
        user.password = await bcrypt.hash(user.password, 10);

        const existinguser: UserInterface | null = await User.findById(userId);

        if (!existinguser) {
            throw new Error("User not found");
        } else {
            await existinguser.updateOne(user);
        }
    }

    static async getAllUser(page: number, limit: number, query: any): Promise<UserInterface[]> {
        return await User.find(query).skip((page - 1) * limit).limit(limit);
    }

    static async deleteUser(userId: string): Promise<void> {
        const existinguser = await User.findById(userId);

        if (!existinguser) {
            throw new Error("User not found");
        } else {
            await existinguser.deleteOne();
        }
    }

    static async getUserDetails(userId: Types.ObjectId): Promise<UserInterface> {
        const user: UserInterface | null = await User.findById(userId)

        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    static async getUserHistory(userId: Types.ObjectId): Promise<any>{
        const quizHistory = await Quiz.aggregate([
            {
              $match: { userId: userId }
            },
            {
              $lookup: {
                from: 'results', 
                localField: '_id',
                foreignField: 'quizId',
                as: 'results'
              }
            },
            {
              $unwind: '$results'
            },
            {
              $project: {
                _id: 1,
                quizNumber: 1,
                questions: 1,
                'results.score': 1,
                'results.createdAt': 1
              }
            }
          ]);

          return quizHistory;
    }
}