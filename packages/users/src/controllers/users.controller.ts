import { NextFunction, Request, Response } from "express";
import debug from "debug";
import userService from "../services/user.service";
import userAddressService from "../services/user.address.service";
import { minimumPermissionRequired } from "../common/auth/middleware/auth.middleware";
import { unlinkUploadedFile } from "../common/uploader";
const log = debug("app:controller:users");

/**
 * Users Controller 
 * Handles all requests that are used to manage users by admin
 */
class UsersController{
    
  /**
   * Get the list of users 
   * @param req 
   * @param res 
   * @param next 
   */
    async getUsers(req:Request,res:Response,next:NextFunction){
      try{
        const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 100;
        const offset = req.query.offset ? parseInt(req.query.offset.toString()): 0;
        log(limit,offset);
        const users = await userService.getUsers({limit:limit>100?100:limit,offset: offset});
        res.send(users);  
      }catch(e){
        next(e);
      }
    }
    

    /**
     * Create new user
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async createUser(req,res:Response,next:NextFunction){
        try{
            const created =  await userService.createUser(req.body);
            return res.status(201)
                      .json(created);
        }catch(e){
            next(e);
        }
        finally{
          unlinkUploadedFile(req);
        }
    }


    /**
     * Get an user using mongoose id
     * @param req 
     * @param res 
     * @param next 
     */
    async getUserById(req:Request,res:Response,next:NextFunction):Promise<void>{
      try{
        log("before get");
        const user = await userService.getAllUserDataById(req.params.id);
        res.send(user);
      }catch(e){
        log(e);
        next(e);
      }
    }
    

    /**
     * Update user info using mongoose id
     * @param req 
     * @param res 
     * @param next 
     */
    async updateUserById(req:Request,res:Response,next:NextFunction):Promise<void>{
      try{
        const user = await userService.getUser(req.params.id);
        await userService.updateUser(user,req.body);
        res.send(user);
      }catch(e){
        next(e);
      }
      finally{
        unlinkUploadedFile(req);
       }
    }

    /**
     * Delete user by mongoose id
     * @param req 
     * @param res 
     * @param next 
     */
    async deleteUserById(req:Request,res:Response,next:NextFunction):Promise<void>{
       try{
        const user = await userService.getUser(req.params.id);
        await userService.deleteUserAccount(user);
        res.sendStatus(204).end();
       }catch(e){
        next(e);
       }
    }

    /**
     * Create an user password reset ticket and send ticket url via email
     * @param req 
     * @param res 
     * @param next 
     */
    async sentPasswordResetEmail(req:Request,res:Response,next:NextFunction){
      try{
        log("invoked send password reset email tiket");
        const user = await userService.getUser(req.params.id);
        const data = await userService.sendPasswordResetEmail(user);
        res.status(200).send(data);
      }catch(e){
        next(e);
      }
    }

    /**
     * Create an email verification ticket and sent link via email
     * @param req 
     * @param res 
     * @param next 
     */
    async sentVerificationEmail(req:Request,res:Response,next:NextFunction){
      try{
        log("invoked send verification email tiket");
        const user = await userService.getUser(req.params.id);
        const data = await userService.sentVerificationEmail(user);
        res.status(200).send(data);
      }catch(e){
        next(e);
      }
    }

    /**
     * Get an user addresses
     * @param req 
     * @param res 
     * @param next 
     */
    async getUserAddresses(req:Request,res:Response,next:NextFunction){
      try{
        const user = await userService.getUser(req.params.id);
        res.json((user).addresses);
      }catch(e){
        next(e);
      }
    }

    /**
     * Get a specific user address
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getUserAddress(req:Request,res:Response,next:NextFunction){
      try{
        const user = await userService.getUser(req.params.id);
        const address = await userAddressService.getUserAddress(user,req.params.address);
        return res.status(200).json(address);
      }catch(e){
        next(e);
      }
    }

    /**
     * Add an user address
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async addUserAddress(req:Request,res:Response,next:NextFunction){
      try{
        const user = await userService.getUser(req.params.id);
        const newAddress = await userAddressService.addUserAddress(user,req.body);
        return res.status(201).json(newAddress);
      }catch(e){
        next(e);
      }
    }

    /**
     * Update user address
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async patchUserAddress(req:Request,res:Response,next:NextFunction){
      try{
        const user = await userService.getUser(req.params.id);
        const address = await userAddressService.getUserAddress(user,req.params.address);
        const patchedAddress = await userAddressService.patchUserAddress(
          user,address,req.body
        );
        return res.status(200).json(patchedAddress);
      }catch(e){
        next(e);
      }
    }

    /**
     * Delete an user address
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async deleteUserAddress(req:Request,res:Response,next:NextFunction){
      try{
        const user = await userService.getUser(req.params.id);
        const address = await userAddressService.getUserAddress(user,req.params.address);
        await userAddressService.deleteUserAddress(user,address);
        return res.status(204).json("0k");
      }catch(e){
        next(e);
      }
    }
}

export default new UsersController();