import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import debug from "debug";
import authService from "../common/auth/auth.service";
import usersService, { UserService } from "../services/users.service";
const log = debug("app:controller:user");
class UsersController{
    
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
        log(JSON.stringify(req.body));
        user.save();
        res.statusCode = 201;
        res.send(user);
    }
    
    async updateUserById(req:Request,res:Response,next:NextFunction):Promise<void>{
        const userId = req.params.id;
        const user = await User.findById(userId);
        await user.update(req.body);
        /// update user data in 
        await user.save();
        res.send(user);
    }

    async deleteUserById(req:Request,res:Response,next:NextFunction):Promise<void>{
       try{
        const user = await usersService.getUserById(req.params.id);
        await usersService.deleteUserAccount(user);
        res.sendStatus(204).end();
       }catch(e){
        next(e);
       }
    }
}

export default new UsersController();