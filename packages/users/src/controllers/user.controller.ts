
import { NextFunction, Request, Response } from "express";
import debug from "debug";
import userService from "../services/user.service";
import User from "../models/user.model";
import IPutProfileDto from "../dto/patch_profile.dto";
import { IRequest } from "../common/types";
import userAddressService from "../services/user.address.service";
const log = debug("app:controller:users");


/**
 * User Controller
 * Handles requests used to manage user account , authenticated user
 */
export class UserController{


    /**
     * Returns JSON object of the authenticated user 
     * @param req 
     * @param res 
     */
    async getUser(req:IRequest,res:Response){
        res.json(req.user);
    }

    /**
     * Returns user profile, only some of user object properties 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getUserProfile(req:IRequest,res:Response,next:NextFunction){
        try{
            return res.json(req.user);   
        }catch(e){
            next(e);
        }
    }
    
    /**
     * Change user password,
     * @param req 
     * @param res 
     * @param next 
     */
    async changeUserPassword(req:IRequest,res:Response,next:NextFunction){
        try{
            const {password} = req.body;
            await userService.updateUser(req.user,{password,});
            res.status(200).json({
                message: "Password changed successfully"
            });
        }catch(e){next(e)};
    }

    /**
     * Change user email address
     * @param req 
     * @param res 
     * @param next 
     */
    async changeUserEmailAddress(req:IRequest,res:Response,next:NextFunction){
        try{
            const {email} = req.body;
            const user = req.user;
            await userService.updateUser(user,{
                email,
            });
            res.status(200).json({
                message: "Email address changed successfully"
            });
        }catch(e){
            next(e);
        }
    }

    /**
     * Update authenticated user profile 
     * @param req 
     * @param res 
     * @param next 
     */
    async updateUserProfile(req:IRequest,res:Response,next:NextFunction){
        const {avatar,birthDate,firstName,gender,lastName} = req.body as IPutProfileDto;
        await userService.updateUser(
            req.user,
        {
            avatar,birthDate,firstName,gender,lastName
        });
        res.send(req.user);
    }


    /**
     * Close authenticated user account
     * @param req 
     * @param res 
     * @param next 
     */
    async closeAccount(req:IRequest,res:Response,next:NextFunction){
       try{
            await userService.updateUser(req.user,{
                status: "closed"
            });
            res.status(200).send();
       }catch(e){
            next(e);
       }
    }


    /**
     * Show user addresses
     * @param req 
     * @param res 
     * @param next 
     */
    async getUserAddresses(req:IRequest,res:Response,next:NextFunction){
        try{
            res.status(200).json(req.user.addresses);
        }catch(e){
            next(e)
        }
    }

    /**
     * Add new address for authenticated user
     * @param req 
     * @param res 
     * @param next 
     */
    async addUserAddress(req:IRequest,res:Response,next:NextFunction){
        try{
            const user = req.user;
            const address = await userAddressService.addUserAddress(user,{...req.body});
            res.status(201).json({id:address._id});
        }catch(e){
            next(e);
        }
    }

    /**
     * Update existing user address
     * @param req 
     * @param res 
     * @param next 
     */
    async patchUserAddress(req:IRequest,res:Response,next:NextFunction){
        try{
            const user = req.user;
            const address = await userAddressService.getUserAddress(user,req.params.address);
            const patchedAddress = await userAddressService.patchUserAddress(user,address,{...req.body});
            res.json(patchedAddress);
        }catch(e){
            next(e);
        }
    }

    /**
     * Delete an user address
     * @param req 
     * @param res 
     * @param next 
     */
    async deleteUserAddress(req:IRequest,res:Response,next:NextFunction){
        try{
            const user = req.user;
            const address = await userAddressService.getUserAddress(user,req.params.address);
            await userAddressService.deleteUserAddress(user,address);
            res.status(204).send("DELETED");
        }catch(e){
            next(e);
        }
    }
}

export default new UserController();