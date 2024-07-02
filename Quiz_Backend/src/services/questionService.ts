import { Types } from "mongoose";
import { QuestionInterface } from "../interfaces/interface";
import Question from "../model/questionModel";
import { PaperUtils } from "../utils/paperUtils";


export class QuestionService {
    static async addQuestion(question: QuestionInterface): Promise<void> {
        const newQuestion = new Question(question);
        await newQuestion.save();
    }

    static async getAllQuestion(page: number, limit: number, query: any): Promise<QuestionInterface[]>{
        return await Question.find(query).skip((page - 1) * limit).limit(limit);
    }

    static async getQuestionsForQuiz(userId: Types.ObjectId, totalQuestions: number): Promise<QuestionInterface[]> {
        const averageScore = await PaperUtils.getUserAverageScore(userId);
        const difficultyLength = await PaperUtils.getRandomDifficultyLength();
        const difficultyRange = await PaperUtils.determineDifficultyRange(averageScore, difficultyLength);
        const questionsPerDifficulty = await PaperUtils.getRandomQuestionsPerDifficulty(totalQuestions, difficultyRange);

        console.log(averageScore, difficultyLength, difficultyRange, questionsPerDifficulty)
        
        const questionIdsByDifficulty: { [key: number]: Types.ObjectId[] } = {};
        for (const difficulty of difficultyRange) {
            const difficultyQuestions = await Question.find({ difficultyRating: difficulty });
            questionIdsByDifficulty[difficulty] = difficultyQuestions.map(question => question._id);
        }

        const questions: QuestionInterface[] = [];
        for (const [difficulty, count] of Object.entries(questionsPerDifficulty)) {
            if (count > 0) {
                const questionIds = questionIdsByDifficulty[parseInt(difficulty, 10)];
                if (questionIds && questionIds.length > 0) {
                    const selectedQuestionIds = PaperUtils.getRandomElementsFromArray(questionIds, count);
                    const difficultyQuestions = await Question.find({ _id: { $in: selectedQuestionIds } });
                    questions.push(...difficultyQuestions);
                }
            }
        }
        
        return questions;
    }
}
