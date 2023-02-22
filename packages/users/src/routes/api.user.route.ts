import { Application } from "express"
import { requiresAuth } from "express-openid-connect";
import { body } from "express-validator";
import { extractUserMiddleware, isAdmin, isUser } from "../common/auth/middleware/auth.middleware";
import userController from "../controllers/user.controller";
import usersController from "../controllers/users.controller";
import validate from "../middleware/validate.middleware";
import newAddressValidationRules from "../middleware/validation_rules/new.address.rules";
import patchAddressValidationRules from "../middleware/validation_rules/patch.address.rules";
import patchProfileRules from "../middleware/validation_rules/patch.profile.rules";

export default class ApiUserRoute{
   
    constructor(private app:Application,private prefix="/api"){
        this.configureRoutes();
    }

    configureRoutes(){

        //// all routes need oauth authentication
        //// only users who have role user can access this account
        this.app.use([
                `/api/v1/user`,
                `/api/user`
            ],extractUserMiddleware, isUser());
        this.app.route('/api/v1/user')
        .get(userController.getUser);

        //// access and update profile
        this.app.route([
            `/api/v1/user/profile`,
            `/api/user/profile`
        ])
        .get(userController.getUserProfile)
        .patch( patchProfileRules(),userController.updateUserProfile);

        /// change email address 
        this.app.post([
            `/api/v1/user/changeEmailAddress`,
            `/api/user/changeEmailAddress`,
            ],body("email").isEmail(),validate,userController.changeUserEmailAddress);

        //// change password
        this.app.post([
                `/api/v1/user/changeUserPassword`,
                `/api/user/changeUserPassword`
            ], body("password").isStrongPassword(), validate, userController.changeUserPassword);

        /// close user account 
        this.app.post([
            `/api/v1/user/closeAccount`,
            `/api/user/closeAccount`
        ],userController.closeAccount);

        /// get and add user addresses
        this.app.route([
            `/api/v1/user/addresses`,
            `/api/user/addresses`
        ])
            .get(userController.getUserAddresses)
            .post( newAddressValidationRules(), userController.addUserAddress );
 
        /// update and delete user address
        this.app.route([
            `/api/v1/user/addresses/:address`,
            `/api/user/addresses/:address`
        ])
            .patch( patchAddressValidationRules(), userController.patchUserAddress,);
    }
}