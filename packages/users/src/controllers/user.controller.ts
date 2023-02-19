import { NextFunction, Request, Response } from "express";
import debug from "debug";
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