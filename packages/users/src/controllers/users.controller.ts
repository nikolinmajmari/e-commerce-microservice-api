import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import debug from "debug";
import usersService from "../services/users.service";
const log = debug("app:controller:user");
class UsersController{
    
    async getUsers(req:Request,res:Response,next:NextFunction){
      try{
        const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 100;
        const offset = req.query.offset ? parseInt(req.query.offset.toString()): 0;
        log(limit,offset);
        const users = await usersService.getUsers({limit:limit>100?100:limit,offset: offset});
        res.send(users);  
      }catch(e){
        next(e);
      }
    }
    
    async createUser(req:Request,res:Response,next:NextFunction){
        try{
            log("creating new user");
            const created =  await usersService.createUser(req.body);
            return res.status(201)
                      .json(created);
        }catch(e){
            next(e);
        }
    }
    
    async updateUserById(req:Request,res:Response,next:NextFunction):Promise<void>{
      try{
        const user = await usersService.getUserById(req.params.id);
        await usersService.updateUserProfile(user);
        res.send(user);
      }catch(e){
        next(e);
      }
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