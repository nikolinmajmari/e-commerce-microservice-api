import {AppMetadata, ManagementClient, ManagementClientOptions, PasswordChangeTicketResponse, User, UserMetadata} from 'auth0';
import debug from 'debug';
import axios from 'axios';
import { IUser } from '../../models/user.model';
import ICreateUserDTO from '../../dto/create_user.dto';
import Conflict from '../errors/http/conflict_error';
import BadRequest from '../errors/http/bad_request_error';
import ICreateOauthUserDTO from '../../dto/create_oauth_user.dto';
import NotFound from '../errors/http/not_found.error.';

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

    async changePassword(auth0UserId:string,newPassword:string):Promise<User<AppMetadata,UserMetadata>>{
        log("changing user password");
        return await this.management.updateUser({id: auth0UserId},{password: newPassword});
    }

    async createUser(user:ICreateOauthUserDTO){
        try{
            log("creating oauth0 user");
            return await this.management.createUser({
                connection: 'Username-Password-Authentication',
                ...user,
                email_verified: false,
                verify_email: false,
            });
        }catch(e){
            this.handleError(e);
        }
    }

    async sendPasswordResetEmailTo({email}:{email:string}):Promise<PasswordChangeTicketResponse>{
       try{
        log("changing oauth0 user password")
        return this.management.createPasswordChangeTicket({
            connection_id:'Username-Password-Authentication',
            ttl_sec:1000,
            email: email,
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
    domain:process.env.AUTH_DOMAIN
});