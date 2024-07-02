import { PipelineStage, Types } from "mongoose";
import Result from "../model/resultModel";

export class PaperUtils{
    static async getUserAverageScore(userId: Types.ObjectId): Promise<number> {
        const agg: PipelineStage[] = [
            {
                $match: {
                    userId: userId
                }
            },
            {
                $group: {
                    _id: null,
                    averageScore: {
                        $avg: "$score"
                    }
                }
            }
        ];

        const result = await Result.aggregate(agg);

        if (result.length === 0) {
            return 0;
        }
        
        return result[0].averageScore;
    }

    static async getRandomDifficultyLength(): Promise<number> {
        const lengths = [2, 3, 4];
        return lengths[Math.floor(Math.random() * lengths.length)];
    }

    static async determineDifficultyRange(averageScore: number, length: number): Promise<number[]> {
        const median = Math.round(averageScore);
        const start = Math.max(median - Math.floor(length / 2), 1);
        const end = Math.min(start + length - 1, 10);
        
        const range: number[] = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        
        while (range.length < length) {
            if (range[0] > 1) {
                range.unshift(range[0] - 1);
            } else if (range[range.length - 1] < 10) {
                range.push(range[range.length - 1] + 1);
            }
        }
    
        return range;
    }

    static async getRandomQuestionsPerDifficulty(totalQuestions: number, difficultyLevels: number[]): Promise<{ [key: number]: number }> {
        const questionsPerDifficulty: { [key: number]: number } = {};
        let remainingQuestions = totalQuestions;
        let difficultyIndex = 0;
        
        while (remainingQuestions > 0 && difficultyIndex < difficultyLevels.length) {
            const level = difficultyLevels[difficultyIndex];
            const numQuestions = Math.min(Math.floor(Math.random() * (remainingQuestions + 1)), remainingQuestions);
            questionsPerDifficulty[level] = (questionsPerDifficulty[level] || 0) + numQuestions;
            remainingQuestions -= numQuestions;
            difficultyIndex++;
    
            if (difficultyIndex === difficultyLevels.length) {
                difficultyIndex = 0;
            }
        }
    
        while (remainingQuestions > 0) {
            for (const level of difficultyLevels) {
                if (remainingQuestions > 0) {
                    questionsPerDifficulty[level] = (questionsPerDifficulty[level] || 0) + 1;
                    remainingQuestions--;
                } else {
                    break;
                }
            }
        }
    
        return questionsPerDifficulty;
    }

    static getRandomElementsFromArray<T>(array: T[], count: number): T[] {
        const shuffledArray = array.slice().sort(() => Math.random() - 0.5); 
        return shuffledArray.slice(0, count);
    }

}