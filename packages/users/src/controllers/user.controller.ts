import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import debug from "debug";
import authService from "../common/auth/auth.service";
const log = debug("app:controller:user");
class UserController{

    async changeUserPassword(req:Request,res:Response){
        ///
    }

    async changeUserEmailAddress(req:Request,res:Response){
        ///
    }

    async updateProfile(req:Request,res:Response,next:NextFunction){
        ///
    }

    async closeAccount(req:Request,res:Response,next:NextFunction){
        ///
    }
}

export default new UserController();