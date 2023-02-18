import { Application } from "express";
import debug from "debug";
import authController from "./auth.controller";
import { requiresAuth } from "express-openid-connect";

const log = debug("app:auth:routes");


export default class AuthRoutes{
    constructor(private app:Application){
        this.configureRoutes();
    }

    configureRoutes(){
        this.app.get("/login",authController.login);
        this.app.get("/profile",requiresAuth(),authController.profile);
    }
}
