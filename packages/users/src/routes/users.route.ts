import { Application } from "express"
import createUserDtoValidation from "../middleware/validation/new_user.validation.";
import usersController from "../controllers/users.controller"
import userById from "../middleware/users/userById";
import userAddressById from "../middleware/users/userAddressById";
import patchUserValidator from "../middleware/validation/patch_user.validation";

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

        /// handlers for /id
        this.app.route("/api/users/:id")
        .all(userById)
        .get(usersController.getUserById)
        .patch([
            ...patchUserValidator(),
            usersController.updateUserById,
        ])
        .delete(usersController.deleteUserById);

        /// password reseter
        this.app.route("/api/users/:id/resetPassword")
        .all(userById)
        .post(usersController.sentPasswordResetEmail);

        /// verify emailer
        this.app.route("/api/users/:id/verifyEmail")
        .all(userById)
        .post(usersController.sentVerificationEmail);


        //// user addresses routes 
        this.app.route("/api/users/:id/addresses")
        .all(userById)
        .get(usersController.getUserAddresses)
        .post(
            usersController.addUserAddress
        );

        this.app.route("/api/users/:id/addresses/:address")
        .all(userAddressById)
        .patch(usersController.patchUserAddress)
        .delete(usersController.deleteUserAddress);
    }
}