import { Application } from "express"
import userController from "../controllers/user.controller";
export default class UsersRoute{
    constructor(private app:Application){
        this.configureRoutes();
    }

    configureRoutes(){
        this.app.route("/api/user/profile")
        .get(userController.getUserProfile)
        .post(userController.updateUserProfile);

        this.app.post(
            "/api/user/changeEmailAddress",
            userController.changeUserEmailAddress
        );
        this.app.post(
            "/api/user/changeUserPassword",
            userController.changeUserPassword
        );
        this.app.post(
            "/api/user/closeAccount",
            userController.closeAccount,
        );
    }
}