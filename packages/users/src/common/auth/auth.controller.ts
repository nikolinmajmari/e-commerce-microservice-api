import { UsersLogGroup } from "@repo/app-event-emitter";
import debug from "debug";
import { NextFunction, Request,Response } from "express";
import ISignUpUserDTO from "../../dto/sign_up_user.dto";
import User from "../../models/user.model";
import userService from "../../services/user.service";
import emitter from "../event_emitter.service";
import mailer from "../mailer";
import { unlinkUploadedFile } from "../uploader";
import authService from "./auth.service";
const log = debug("app:auth:controller");

class AuthController{

    login(req:Request,res:Response){
        log("user logged in, redirecting to profile");
        res.oidc.login({returnTo:"/profile",silent: false,});
      // usersEventEmitter.emitUserLoginEvent(req);
    }

    logout(req:Request,res:Response){
        emitter.logUserLogOut(req);
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
            const {email} = req.body;
            const ticket = await authService.createPassowrdResetTicket({
                email:email,
                connection_id:process.env.AUTH_CONNECTION_ID,
            });
            const user = await User.findOne({email});
            if(user){
                const mail = await mailer.sentPasswordResetEmail(user,ticket);
                log(mail);
            }
            res.send({
                message: "reset password email was sent to account if it exists"
            });
            emitter.logAnonymousAction(UsersLogGroup.CHANGE_PASSWORD,req,`Unauthenticated user tried to ask for a password change`);
        }catch(e){
            log(e);
            next(e);
        }
    }

    async signUp(req,res,next){
       try{
        console.log(req.body);
        const {addresses,avatar,birdhDate,email,firstName,gender,lastName,password,phone,status,username} = req.body as ISignUpUserDTO; 
        const user = await userService.createUser({
            addresses,avatar,birdhDate,email,firstName,gender,lastName,password,phone,status,username
        });
        res.send({
            id: user._id
        })
       }catch(e){
        unlinkUploadedFile(req);
        next(e);
       }
    }

}

export default new AuthController();