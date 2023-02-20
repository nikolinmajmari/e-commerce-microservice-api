
import { NextFunction, Request, Response } from "express";
import debug from "debug";
import usersService from "../services/users.service";
const log = debug("app:controller:users");
export class UserController{
    
    async getUserProfile(req:Request,res:Response){
        return res.json({
            user: req.oidc.user,
            accessToken:req.oidc.accessToken,
            idToken:req.oidc.idToken
        });
    }
    
    async changeUserPassword(req:Request,res:Response,next:NextFunction){
        //// get current user 
    }

    async changeUserEmailAddress(req:Request,res:Response,next:NextFunction){
        /// get current user 
    }

    async updateUserProfile(req:Request,res:Response,next:NextFunction){
        /// update user profile 
    }

    async closeAccount(req:Request,res:Response,next:NextFunction){
        /// close account
    }
}

export default new UserController();