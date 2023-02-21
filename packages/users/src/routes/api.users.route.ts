import { Application } from "express";
import { extractUserMiddleware, isAdmin } from "../common/auth/middleware/auth.middleware";
import usersController from "../controllers/users.controller";
import userById from "../middleware/users/userById";
import userAddressById from "../middleware/users/userAddressById";
import newAddressRules from "../middleware/validation_rules/new.address.rules";
import newUserRules from "../middleware/validation_rules/new.user.rules";
import patchUserRules from "../middleware/validation_rules/patch.user.rules";
import patchAddressRules from "../middleware/validation_rules/patch.address.rules";


export default class ApiUsersRoute{
    
    constructor(private app:Application){
        this.configureRoutes();
    }

    //api/users
    configureRoutes(){

        this.app.use(`/api/v1/users`,extractUserMiddleware,isAdmin());

        //api/users
        this.app.route(`/api/v1/users`)
        .get(usersController.getUsers)
        .post( newUserRules(), usersController.createUser);
        
        //api/user/:id
        this.app.route(`/api/v1/users/:id`)
        .all(userById)
        .get(usersController.getUserById)
        .patch(patchUserRules(),usersController.updateUserById,)
        .delete(usersController.deleteUserById);
        
        //api/user/:id/resetPassword 
        this.app.route(`/api/v1/users/:id/resetPassword`)
        .all(userById)
        .post(usersController.sentPasswordResetEmail);

        //api/user/:id/verifyEmail 
        this.app.route(`/api/v1/users/:id/verifyEmail`)
        .all(userById)
        .post(usersController.sentVerificationEmail);

        //api/user/:id/addresses
        this.app.route(`/api/v1/users/:id/addresses`)
        .all(userById)
        .get(usersController.getUserAddresses)
        .post( newAddressRules(), usersController.addUserAddress );


        //api/user:id/addresses/:address
        this.app.route(`/api/v1/users/:id/addresses/:address`)
        .all(userAddressById)
        .patch(patchAddressRules(),usersController.patchUserAddress)
        .delete(usersController.deleteUserAddress);
    }
}