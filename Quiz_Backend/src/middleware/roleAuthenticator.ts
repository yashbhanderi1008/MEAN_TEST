import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../interfaces/interface";

export class RoleAuthorize{
    private endUsers: string[];

    constructor(endUsers: string[]){
        this.endUsers = endUsers;
        this.authorizeUser = this.authorizeUser.bind(this);
    }

    public authorizeUser(req: Request, res: Response, next: NextFunction){
        const role = (req as CustomRequest).user.role;

        if(!this.endUsers.includes(role!)){
            return res.status(401).send({ message: 'You are not authorized to perform this action' });
        }

        next();
    }
}

export default RoleAuthorize;