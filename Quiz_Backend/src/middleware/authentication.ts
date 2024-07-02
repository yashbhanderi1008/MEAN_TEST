import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import User from "../model/userModel";
import { SECRET_KEY } from "../config/config";
import { CustomRequest, UserInterface } from "../interfaces/interface";

export const authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization');
        
        if (!token) {
            return res.status(401).send({ message: 'Token is not set in Request Header' });
        }

        token = token.replace('Bearer ', '');

        const decoded = jwt.verify(token, `${SECRET_KEY}`) as JwtPayload;

        const user: UserInterface | null = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).send({ message: 'Authorization Error' });
        }

        (req as CustomRequest).user = {
            userId: decoded.userId,
            username: user.username,
            role: user.role
        }

        next();
    } catch (error: any) {
        res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
}