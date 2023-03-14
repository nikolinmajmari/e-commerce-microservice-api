import {AppMetadata, DatabaseAuthenticator, DatabaseClientOptions, EmailVerificationTicketOptions, ManagementClient, ManagementClientOptions, OAuthAuthenticator, OAuthClientOptions, ObjectWithId, PasswordChangeTicketResponse, User, UserMetadata, VerificationEmailJob} from 'auth0';
import debug from 'debug';
import { IPermissionLevel, IUser } from '../../models/user.model';
import Conflict from '../errors/http/conflict_error';
import BadRequest from '../errors/http/bad_request_error';
import NotFound from '../errors/http/not_found.error.';
import { IAuth0Service, IAuth0UserType } from './auth.types';
import { CoreAppMetadata } from './metadata/core.app-metadata';
import { CoreUserMetadata } from './metadata/core.user-metadata';
import ICreateUserDTO from '../../dto/create_user.dto';
import { auth } from 'express-openid-connect';

const log = debug('app:common:auth:service');
/**
 * This class defines the instance used to manage users from auth0 database
 */
export class Auth0Service implements IAuth0Service{
    management: ManagementClient<CoreAppMetadata,CoreUserMetadata>;
    databaseAuthenticator: DatabaseAuthenticator<CoreAppMetadata,CoreUserMetadata>;
    authenticator: OAuthAuthenticator;
    constructor(options: ManagementClientOptions&DatabaseClientOptions&OAuthClientOptions){
        this.management = new ManagementClient<CoreAppMetadata,CoreUserMetadata>({
            clientId: options.clientId,
            clientSecret: options.clientSecret,
            domain: options.domain
        });
        // this.authenticator = new OAuthAuthenticator({
        //     clientId: options.clientId,
        //     clientSecret: options.clientSecret,
        //     baseUrl: options.scope
        // });
        // this.databaseAuthenticator = new DatabaseAuthenticator({
        //     baseUrl: options.baseUrl,
        //     clientId: options.clientId,
        // },this.authenticator);
    }

    /**
     * This method handles all errors thrown from Auth0Service and wraps them with app error classes
     * @param e 
     */
    private handleError (e) {
        switch(e.statusCode){
            case 400:
                throw new BadRequest(e);
            case 409:
                throw new Conflict(e.message,e);
            default:
                throw e;
        }
    }

    /**
     * This method updates an existing user in database, if user does not exist an Not found should be exploieded
     * Also updates work only for status,email,name and password properties 
     * @param auth0UserId 
     * @param update 
     * @param role 
     * @returns 
     */
    async updateUser(
        auth0UserId:string,
        update:CoreAppMetadata|CoreUserMetadata,
        role?:IPermissionLevel
    ):Promise<void>{
        const {id,permissionLevel,phone,status,username} = update;
        const {avatar,birthDate,firstName,gender,lastName} = update;
        log({ 
            app_metadata:{ id,permissionLevel,phone,status,username},
            user_metadata: {avatar,birthDate,firstName,gender,lastName},
        },);
        await this.management.updateUser({id: auth0UserId},
            {   name: `${firstName} ${lastName}`,
                app_metadata:{ id,permissionLevel,phone,status,username},
                user_metadata: {avatar,birthDate,firstName,gender,lastName},
            },
        );
        if(role){
            this.assignRoleToUser(auth0UserId,role);
        }
    }


    async updateUserEmail(auth0UserId: string, newEmail: string, verifyEmail: boolean) {
        return await this.management.updateUser({id:auth0UserId},
            {email: newEmail,verify_email: verifyEmail}
        );
    }


    /**
     * Creates an new user i n auth0 database using Username-Password-Authentication as connection type
     * @param user 
     * @returns 
     */
    async createUser(user:ICreateUserDTO){
        try{
            log("creating oauth0 user");
            const {
                email,firstName,lastName,password,permissionLevel,status,phone,username
            } = user;
            const oauthUser =  await this.management.createUser({
                connection: 'Username-Password-Authentication',
                ...{
                    email:email,
                    name:`${firstName} ${lastName}`,
                    password,
                },
                email_verified: false,
                verify_email: true,
                app_metadata:{ phone,username,permissionLevel,status:status??"active" },
                user_metadata: {
                    firstName,lastName,
                    avatar: user.avatar,
                    birthDate: user.birdhDate,
                    gender:user.gender,
                }
            });
            this.assignRoleToUser(oauthUser.user_id,permissionLevel);
            return oauthUser;
        }catch(e){
            this.handleError(e);
        }
    }
    
    /**
     * This function assigns a certain role to user in management api
     * @param auth0UserId 
     * @param userRole 
     */
    async assignRoleToUser(auth0UserId:string,userRole:string){
        log("assigning role to user");
        const roles = await this.management.getRoles();

        const role = roles.find((role)=>{
            return role.name===userRole;
        })
        if(role){
            await this.management.assignRolestoUser({id:auth0UserId},{roles:[role.id]});
        }
    }

    /**
     * This function creates a password reset ticket which can be used to reset password if sended via a link
     * @param param0 
     * @returns 
     */
    async createPassowrdResetTicket({user_id,connection_id,email}:{user_id?:string,connection_id?:string,email:string}):Promise<PasswordChangeTicketResponse>{
       try{
        log("changing oauth0 user password",user_id,connection_id,email);
        const data = user_id 
        ?
        {user_id}:{ connection_id:process.env.AUTH_CONNECTION_ID, email};
        return this.management.createPasswordChangeTicket({
            ...data,
            ttl_sec:600
        })
       }catch(err){
        this.handleError(err);
       }
    }

    /**
     * This function creates an email verification ticket, a link that can be used to verify emails
     * @param param0 
     * @returns 
     */
    async createEmailVerificationTicket({user_id}:{user_id:string}):Promise<EmailVerificationTicketOptions>{
        try{
            log("creating email verification ticket");
            return this.management.createEmailVerificationTicket({
                user_id,
                ttl_sec:86400
            })
        }catch(err){
            this.handleError(err);
        }
    }


    async createEmailVerificationJob({user_id}:{user_id:string}):Promise<VerificationEmailJob>{
        return await this.management.sendEmailVerification({
            user_id: user_id,
        })
    }

    /**
     * Fids oauth0 user by email address
     * @param email 
     * @returns 
     */
    async findUserByEmail(email:string){
        const user = await this.management.getUsersByEmail(email);
        if(user && user[0] && user[0].user_id){
            return user[0];
        }
        throw new NotFound("User was not found on oauth0 db"); 
    }

    /**
     * Removes auth0 user
     * @param email 
     */
    async findAndRemoveUserByEmail(email:string){
        const user = await this.findUserByEmail(email);
        await this.management.deleteUser({
            id: user.user_id
        });
    }


    async signIn(email:string){
        
        ///
    }
}

export default new Auth0Service({
    clientId:process.env.AUTH_CLIENT_ID,
    clientSecret:process.env.AUTH_CLIENT_SECRET,
    domain:process.env.AUTH_DOMAIN,
    baseUrl: process.env.AUTH_ISSUER_BASE_URL,
});