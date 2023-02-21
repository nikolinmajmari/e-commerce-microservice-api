
import { NextFunction, Request, Response } from "express";
import debug from "debug";
import usersService from "../services/users.service";
import User from "../models/user.model";
import IPutProfileDto from "../dto/put_profile.dto";
import { IRequest } from "../common/types";
const log = debug("app:controller:users");
export class UserController{

    async getUserProfile(req:IRequest,res:Response,next:NextFunction){
        try{
            return res.json(req.user);   
        }catch(e){
            next(e);
        }
    }
    
    async changeUserPassword(req:IRequest,res:Response,next:NextFunction){
        const {password} = req.body;
        await usersService.updateUser(req.user,{password,});
        res.status(200).json({
            message: "Password changed successfully"
        });
    }

    async changeUserEmailAddress(req:IRequest,res:Response,next:NextFunction){
        const {email} = req.body;
        const user = req.user;
        await usersService.updateUser(await User.findOne({}),{
            email,
        });
        res.status(200).json({
            message: "Password changed successfully"
        });
    }

    async updateUserProfile(req:IRequest,res:Response,next:NextFunction){
        const {avatar,birthDate,firstName,gender,lastName} = req.body as IPutProfileDto;
        await usersService.updateUser(
            req.user,
        {
            avatar,birthDate,firstName,gender,lastName
        });
        res.send(req.user);
    }

    async closeAccount(req:IRequest,res:Response,next:NextFunction){
        await usersService.updateUser(req.user,{
            status: "closed"
        });
        res.status(200).send();
    }


    async getUserAddresses(req:IRequest,res:Response,next:NextFunction){
        try{
            res.status(200).json(req.user.addresses);
        }catch(e){
            next(e)
        }
    }

    async addUserAddress(req:IRequest,res:Response,next:NextFunction){
        try{
            const user = req.user;
            const address = await usersService.addUserAddress(user,{...req.body});
            res.status(201).json({id:address._id});
        }catch(e){
            next(e);
        }
    }

    async patchUserAddress(req:IRequest,res:Response,next:NextFunction){
        try{
            const user = req.user;
            const address = await usersService.getUserAddress(user,req.params.address);
            const patchedAddress = await usersService.patchUserAddress(user,address,{...req.body});
            res.json(patchedAddress);
        }catch(e){
            next(e);
        }
    }

    async deleteUserAddress(req:IRequest,res:Response,next:NextFunction){
        try{
            const user = req.user;
            const address = await usersService.getUserAddress(user,req.params.address);
            await usersService.deleteUserAddress(user,address);
            res.status(204).send("DELETED");
        }catch(e){
            next(e);
        }
    }
}

export default new UserController();