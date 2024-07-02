import mongoose from "mongoose";
import { UserInterface } from "../interfaces/interface";
import { Role } from "../enum/enum";


const userSchema = new mongoose.Schema<UserInterface>({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [Role.Admin, Role.User],
        default: Role.User
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;