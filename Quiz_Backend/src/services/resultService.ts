import { PipelineStage, Types } from "mongoose";
import Result from "../model/resultModel";
import { ResultInterface } from "../interfaces/interface";

export class ResultService {
    static async addResult(userId: Types.ObjectId, score: number, quizId: Types.ObjectId): Promise<void> {
        const newResult = new Result({
            userId: userId,
            quizId: quizId,
            score: score
        });
        
        await newResult.save();
    }

    static async getUserLastResult(userId: Types.ObjectId): Promise<ResultInterface> {
        const lastResult: ResultInterface | null = await Result.findOne({ userId }).sort({ quizNumber: -1 });

        if (lastResult) {
            return lastResult;
        }

        throw new Error("You not give any Quiz");
    }
}