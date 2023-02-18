import debug from "debug";
import { Request,Response } from "express";
const log = debug("app:auth:controller");

class AuthController{

    login(req:Request,res:Response){
        log("user logged in, redirecting to profile");
        res.oidc.login({returnTo:"/profile"});
    }

    async profile(req:Request,res:Response){
        log("profile endpoint for "+req.oidc.user.sub);
        res.send({
            user:req.oidc.user,
            access_toekn:req?.oidc?.accessToken,
            id_token: req.oidc.idToken
        })
    }

}

export default new AuthController();