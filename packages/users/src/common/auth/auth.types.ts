import {User,AppMetadata,UserMetadata, EmailVerificationTicketOptions, PasswordChangeTicketResponse} from "auth0";
import ICreateOauthUserDTO from "../../dto/create_oauth_user.dto";
import IUpdateOauthUserDTO from "../../dto/update_oauth_user.dto";
import {IPermissionLevel} from "../../models/user.model";
export interface IAuth0Service{
    findUserByEmail(
        email:string
    ):Promise<User<AppMetadata,UserMetadata>>;
    updateUser(
        auth0UserId:string,
        update:IUpdateOauthUserDTO,
        role?:IPermissionLevel
    ):Promise<User<AppMetadata,UserMetadata>>;
    
    createUser(
        user:ICreateOauthUserDTO,
        role:IPermissionLevel
    ):Promise<User<AppMetadata, UserMetadata>>;

    assignRoleToUser(
        user:User<AppMetadata, UserMetadata>,
        userRole:string
    ):Promise<User<AppMetadata, UserMetadata>>;

    sendPasswordResetEmailTo(
        {user_id,connection_id,email}:{user_id?:string,connection_id?:string,email:string}
    ):Promise<PasswordChangeTicketResponse>;
    sentEmailVerification(
        {user_id}:{user_id:string}
    ):Promise<EmailVerificationTicketOptions>;
    findAndRemoveUserByEmail(email:string);
}