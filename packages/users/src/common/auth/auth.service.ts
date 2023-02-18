import {AppMetadata, ManagementClient, ManagementClientOptions, PasswordChangeTicketResponse, User, UserMetadata} from 'auth0';
import debug from 'debug';
import axios from 'axios';
import { IUser } from '../../models/user.model';
import ICreateUserDTO from '../../dto/create_user.dto';

const log = debug('app:auth:service');
export class Auth0Service{
    management: ManagementClient;
    constructor(options: ManagementClientOptions){
        this.management = new ManagementClient(
            options
        );
    }

    async changePassword(auth0UserId:string,newPassword:string):Promise<User<AppMetadata,UserMetadata>>{
        return await this.management.updateUser({id: auth0UserId},{password: newPassword});
    }

    async createUser(user:ICreateUserDTO){
        const {email,password} = user;
        return await this.management.createUser({
            connection: 'Username-Password-Authentication',
            email,
            password,
            email_verified: false,
            verify_email: false,
        })
    }

    async sendPasswordResetEmailTo({email}:{email:string}):Promise<PasswordChangeTicketResponse>{
        return this.management.createPasswordChangeTicket({
            connection_id:'Username-Password-Authentication',
            ttl_sec:1000,
            email: email,
        })
    }

    async findAndRemoveUserByEmail(email:string){
        const user = await this.management.getUsersByEmail(email);
        if(user && user[0] && user[0].user_id){
            return this.management.deleteUser({
                id: user[0].user_id
            });
        }else{
            throw 'noAuthUserFound';
        }
    }
}

export default new Auth0Service({
    clientId:process.env.AUTH_CLIENT_ID,
    clientSecret:process.env.AUTH_CLIENT_SECRET,
    domain:process.env.AUTH_DOMAIN
});