import { Application } from "express";
import debug from "debug";
import authController from "./auth.controller";
import { requiresAuth } from "express-openid-connect";
import newUserRules from "../../middleware/validation_rules/new.user.rules";
const log = debug("app:auth:routes");

export default class AuthRoutes{
    constructor(private app:Application){
        this.configureRoutes();
    }

    configureRoutes(){
        this.app.get("/login",authController.login);
        this.app.get("/profile",requiresAuth(),authController.profile);
        this.app.get("/callback",requiresAuth(),authController.profile);
        this.app.get("/logout",requiresAuth(),authController.logout);
        this.app.post("/forgotPassword",authController.resetPassword);
        this.app.post(
            "/signup",
        newUserRules(),
        authController.signUp);
    }
}
