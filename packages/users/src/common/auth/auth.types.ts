import {User,AppMetadata,UserMetadata, EmailVerificationTicketOptions, PasswordChangeTicketResponse, VerificationEmailJob} from "auth0";
import ICreateOauthUserDTO from "../../dto/create_oauth_user.dto";
import { IUpdateUserDto } from "../../dto/update_user.dto";
import {IAccountStatus, IPermissionLevel} from "../../models/user.model";

export interface IAuth0Service{
    findUserByEmail(
        email:string
    ):Promise<User<AppMetadata,UserMetadata>>;
    updateUser(
        auth0UserId:string,
        update:IAuth0UserType,
        role?:IPermissionLevel
    );
    
    createUser(
        user:IAuth0UserType,
    ):Promise<User<AppMetadata, UserMetadata>>;

    assignRoleToUser(
        auth0UserId:string,
        userRole:string
    );

    createPassowrdResetTicket(
        {user_id,connection_id,email}:{user_id?:string,connection_id?:string,email:string}
    ):Promise<PasswordChangeTicketResponse>;
    createEmailVerificationTicket(
        {user_id}:{user_id:string}
    ):Promise<EmailVerificationTicketOptions>;
    findAndRemoveUserByEmail(email:string);

    createEmailVerificationJob({user_id}:{user_id:string}):Promise<VerificationEmailJob>;
}


export interface IAuth0UserType{
    email?:string,
    password?:string,
    name?: string,
    picture?: string,
    status?: IAccountStatus,
    role?:IPermissionLevel
}

/**
 * 
 * @param dto 
 * @returns 
 */
export function fromUserDto( dto:IUpdateUserDto ):IAuth0UserType{
    const res:IAuth0UserType = {};
    const {email,password,firstName,lastName,status} = dto;
    if(firstName&&lastName){
        res.name = `${firstName} ${lastName}`;
    }
    if(email){
        res.email = email;
    }
    if(password){
        res.password = password;
    }
    if(status){
        res.status = status;
    }
    return res;
}