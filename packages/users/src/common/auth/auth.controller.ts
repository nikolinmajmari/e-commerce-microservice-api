import debug from "debug";
import { NextFunction, Request,Response } from "express";
import ISignUpUserDTO from "../../dto/sign_up_user.dto";
import userService from "../../services/user.service";
import usersEventEmitter from "../emmiter";
import authService from "./auth.service";
const log = debug("app:auth:controller");

class AuthController{

    login(req:Request,res:Response){
        usersEventEmitter.emitUserLoginEvent(req);
        log("user logged in, redirecting to profile");
        res.oidc.login({returnTo:"/profile",silent: false,});
    }

    logout(req:Request,res:Response){
        usersEventEmitter.emitUserLogoutEvent(req);
        log("user logged out");
        res.oidc.logout({returnTo:"/"});
    }

    async profile(req:Request,res:Response){
        log("profile endpoint for "+req.oidc.user.sub);
        res.send({
            user:req.oidc.user,
            access_toekn:req?.oidc?.accessToken,
            id_token: req.oidc.idToken
        });
    }

    async resetPassword(req:Request,res:Response,next:NextFunction){
        log("requesting chengin password");
        try{
            const ticket = await authService.createPassowrdResetTicket({
                email:req.query.email.toString(),
                connection_id:process.env.AUTH_CONNECTION_ID,
            });
            res.send(ticket);
        }catch(e){
            next(e);
        }
    }

    async signUp(req,res,next){
       try{
        const {addresses,avatar,birdhDate,email,firstName,gender,lastName,password,phone,status,username} = req.body as ISignUpUserDTO; 
        await userService.createUser({
            addresses,avatar,birdhDate,email,firstName,gender,lastName,password,phone,status,username
        });
       }catch(e){
        next(e);
       }
    }

}

export default new AuthController();