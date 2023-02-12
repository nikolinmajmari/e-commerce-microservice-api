import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

class UserController{
    
    getUsers(req:Request,res:Response,next:NextFunction):void{
        User.find({},{},null,function(err,users){
            if(err){
                return next(err);
            }
            return res.json(users);
        })
    }
    
    createUser(req:Request,res:Response,next:NextFunction):void{
        const user = User.build(req.body);
        user.save();
        res.statusCode = 201;
        res.send(user);
    }

}

export default new UserController();