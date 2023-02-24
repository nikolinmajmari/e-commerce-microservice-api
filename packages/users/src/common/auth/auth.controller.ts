import debug from "debug";
import { NextFunction, Request,Response } from "express";
import emmiter from "../emmiter";
import authService from "./auth.service";
const log = debug("app:auth:controller");

class AuthController{

    login(req:Request,res:Response){
        log("user logged in, redirecting to profile");
        res.oidc.login({returnTo:"/profile",silent: false});
    }

    logout(req:Request,res:Response){
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

}

export default new AuthController();