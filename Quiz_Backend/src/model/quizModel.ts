import mongoose from 'mongoose';
import { QuizInterface } from "../interfaces/interface";

const quizSchema = new mongoose.Schema<QuizInterface>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }],
    quizNumber: {
        type: Number,
        required: true
    }
})

const Quiz = mongoose.model<QuizInterface>('Quiz', quizSchema);

export default Quiz;
