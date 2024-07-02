import mongoose from 'mongoose';
import { QuestionInterface } from '../interfaces/interface';

const questionSchema = new mongoose.Schema<QuestionInterface>({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: [(val: string[]) => val.length === 4, 'Exactly four options are required']
    },
    correctOptionIndex: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    difficultyRating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    }
}, {
    timestamps: true
});

const Question = mongoose.model<QuestionInterface>('Question', questionSchema);

export default Question;
