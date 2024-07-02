import { Request, Response } from "express";
import { UserServices } from "../services/userService";
import { CustomRequest } from "../interfaces/interface";
import { QuestionService } from "../services/questionService";
import Quiz from "../model/quizModel";
import { Role } from "../enum/enum";
import { ResultService } from "../services/resultService";
import { PipelineStage, Types } from "mongoose";

export class UserController {
    static async signUp(req: Request, res: Response): Promise<void> {
        try {
            const user = req.body;

            await UserServices.createUser(user);

            res.status(201).json({ message: "User created successfully" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, role } = req.body;
            const token = await UserServices.login(email, password);
            res.status(200).json({ data: token, message: "User logged in successfully" });

        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const user = req.body;
            const userId = (req as CustomRequest).user.userId;

            await UserServices.updateUser(user, userId);

            res.status(200).json({ message: "User updated successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.userId;

            await UserServices.deleteUser(userId);

            res.status(200).json({ message: "User deleted successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async addQuestion(req: Request, res: Response): Promise<void> {
        try {
            const question = req.body;
            const role = (req as CustomRequest).user.role;

            if (role !== Role.Admin) {
                res.status(403).json({ message: "You are not authorized to perform this action" });
                return;
            }

            await QuestionService.addQuestion(question);

            res.status(201).json({ message: "Question added successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async allQuestion(req: Request, res: Response): Promise<void> {
        try {
            let query: any = {};
            const { searchParameter, page, limit } = req.query

            if (searchParameter) {
                query.categoryName = searchParameter;
            }

            const data = await QuestionService.getAllQuestion(Number(page), Number(limit), query);

            res.status(200).json({ data });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async allUser(req: Request, res: Response): Promise<void> {
        try {
            let query: any = {};
            const { searchParameter, page, limit } = req.query

            if (searchParameter) {
                query.categoryName = searchParameter;
            }

            const data = await UserServices.getAllUser(Number(page), Number(limit), query);

            res.status(200).json({ data });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async generateQuiz(req: Request, res: Response): Promise<void> {
        try {
            const userId = new Types.ObjectId((req as CustomRequest).user.userId);
            const totalQuestions = 10;

            const quizQuestions = await QuestionService.getQuestionsForQuiz(userId, totalQuestions)

            const agg: PipelineStage[] = [
                { $match: { userId: userId } },
                { $sort: { quizNumber: -1 } },
                { $limit: 1 }
            ]

            const result = await Quiz.aggregate(agg);
            const quizNumber = result[0] ? result[0].quizNumber + 1 : 1;

            const quiz = new Quiz({
                userId: userId,
                questions: quizQuestions,
                quizNumber: quizNumber
            })

            await quiz.save();

            res.status(200).json({ data: quiz, message: "Your next quiz is prepared" })
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async addResult(req: Request, res: Response): Promise<void> {
        try {
            const score = Number(req.body.score);
            const quizId = new Types.ObjectId(req.body.quizId);
            const userId = new Types.ObjectId((req as CustomRequest).user.userId)
            const role = (req as CustomRequest).user.role;

            if (role !== Role.User) {
                res.status(403).json({ message: "You are not authorized to perform this action" });
                return;
            }
            
            await ResultService.addResult(userId, score, quizId);

            res.status(201).json({ message: "Result added successfully" })
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async lastResult(req: Request, res: Response): Promise<void> {
        try {
            const userId = new Types.ObjectId((req as CustomRequest).user.userId)

            const details = await ResultService.getUserLastResult(userId)

            res.status(200).json({ data: details })
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getDetails(req: Request, res: Response): Promise<void> {
        try {
            const userId = new Types.ObjectId((req as CustomRequest).user.userId)

            const details = await UserServices.getUserDetails(userId)

            res.status(200).json({ data: details })
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getHistory(req: Request, res: Response): Promise<void> {
        try {
            const userId = new Types.ObjectId((req as CustomRequest).user.userId)

            const history = await UserServices.getUserHistory(userId)

            res.status(200).json({ data: history })
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}


