import { Application } from "express"
import createUserDtoValidation from "../middleware/validation/create_user_dto.validation";
import usersController from "../controllers/users.controller"
import userById from "../middleware/users/userById";

export default class UsersRoute{
    constructor(private app:Application){
        this.configureRoutes();
    }

    configureRoutes(){
        this.app.route("/api/users")
        .get(usersController.getUsers)
        
        /// configure post users 
        .post(
            ...createUserDtoValidation(),
            usersController.createUser
        );

        this.app.route("/api/users/:id")
        .all(userById)
        .patch(usersController.updateUserById)
        .delete(usersController.deleteUserById);
    }
}