import {AppMetadata, EmailVerificationTicketOptions, ManagementClient, ManagementClientOptions, PasswordChangeTicketResponse, User, UserMetadata} from 'auth0';
import debug from 'debug';
import axios from 'axios';
import { IPermissionLevel, IUser } from '../../models/user.model';
import ICreateUserDTO from '../../dto/create_user.dto';
import Conflict from '../errors/http/conflict_error';
import BadRequest from '../errors/http/bad_request_error';
import ICreateOauthUserDTO from '../../dto/create_oauth_user.dto';
import NotFound from '../errors/http/not_found.error.';
import IUpdateOauthUserDTO from '../../dto/update_oauth_user.dto';

const log = debug('app:common:auth:service');
export class Auth0Service{
    management: ManagementClient;
    constructor(options: ManagementClientOptions){
        this.management = new ManagementClient(
            options
        );
    }

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

    async updateUser(auth0UserId:string,update:IUpdateOauthUserDTO,role?:IPermissionLevel):Promise<User<AppMetadata,UserMetadata>>{
        log("updating user data with role",role);
        const oauthUser =  await this.management.updateUser({id: auth0UserId},
            {
                ...update
            }
        );
        if(role){
            return this.assignRoleToUser(oauthUser,role);
        }
        return oauthUser;
    }

    async createUser(user:ICreateOauthUserDTO,role:IPermissionLevel){
        try{
            log("creating oauth0 user");
            const oauthUser =  await this.management.createUser({
                connection: 'Username-Password-Authentication',
                ...user,
                email_verified: false,
                verify_email: true,
            });
            return this.assignRoleToUser(oauthUser,role);
        }catch(e){
            this.handleError(e);
        }
    }

    async assignRoleToUser(user:User<AppMetadata, UserMetadata>,userRole:string){
        log("assigning role to user");
        const roles = await this.management.getRoles();

        const role = roles.find((role)=>{
            return role.name===userRole;
        })
        if(role){
            await this.management.assignRolestoUser({id:user.user_id},{roles:[role.id]});
        }
        return user;
    }

    async sendPasswordResetEmailTo({user_id,connection_id,email}:{user_id?:string,connection_id?:string,email:string}):Promise<PasswordChangeTicketResponse>{
       try{
        log("changing oauth0 user password",user_id,connection_id,email);
        return this.management.createPasswordChangeTicket({
            user_id,
            connection_id,
            email,
            ttl_sec:600
        })
       }catch(err){
        this.handleError(err);
       }
    }

    async sentEmailVerification({user_id}:{user_id:string}):Promise<EmailVerificationTicketOptions>{
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

    async findAndRemoveUserByEmail(email:string){
        const user = await this.management.getUsersByEmail(email);
        if(user && user[0] && user[0].user_id){
            return this.management.deleteUser({
                id: user[0].user_id
            });
        }else{
            throw new NotFound("User was not found on oauth0 db");
        }
    }
}

export default new Auth0Service({
    clientId:process.env.AUTH_CLIENT_ID,
    clientSecret:process.env.AUTH_CLIENT_SECRET,
    domain:process.env.AUTH_DOMAIN,
});