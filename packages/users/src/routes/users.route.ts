import { Application } from "express"
import usersController from "../controllers/users.controller"

export default class UsersRoute{
    constructor(private app:Application){
        this.configureRoutes();
    }

    configureRoutes(){
        this.app.route("/api/users")
        .get(usersController.getUsers)
        .post(usersController.createUser);
    }
}