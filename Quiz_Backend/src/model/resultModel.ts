import mongoose from 'mongoose';
import { ResultInterface } from '../interfaces/interface';

const resultSchema = new mongoose.Schema<ResultInterface>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    }
}, {
    timestamps: true
});
const Result = mongoose.model<ResultInterface>('Result', resultSchema);

export default Result;
