import authService from "../common/auth/auth.service";
import ICreateUserDTO from "../dto/create_user.dto";
import { ListUsersInput } from "../dto/list_user.input";
import User, { IPermissionLevel, IUser } from "../models/user.model";
import debug from "debug";
import mongooseService from "../common/mongoose";
import IPatchUserDTO from "../dto/patch_user_dto";
import { fromUserDto, IAuth0Service } from "../common/auth/auth.types";
import { User as AuthUser } from "auth0";
const log = debug("app:services:UserService");

export class UserService{

    constructor(private auth:IAuth0Service){}

    private startMongooseSession() {
        return mongooseService.getMongoose().startSession();
    }
    /**
     * 
     * @param {limit,offset} ListUsersInput limit the limit of records, offset where to start 
     * @returns 
     */
    async getUsers({limit, offset}: ListUsersInput) {
        log(`geting users for offset ${offset}, limit ${limit} `)
        return await User.find({}).exec();
    }
    
    /**
     * Gets an user by id 
     * @param id user id
     * @returns user instance of mongoose
     */
    async getUser(id:string){
        const user =  await User.findById(id);
        return user;
    }

    async getUserByUserId(id:string){
        return await User.findOne({user_id:id});
    }

    async getAllUserDataById(id:string){
        const userDoc = await this.getUser(id);
        log(userDoc);
        const oauthUser  = await this.auth.findUserByEmail(userDoc.email);
        return {
            ...userDoc.toJSON(),
            email_verified:oauthUser.email_verified,
        }
    }


    async createUserFromOauthUser(oauthUser:AuthUser,permission:IPermissionLevel){
        const [firstName,lastName] = oauthUser.name.split(" ");
        const newUser = User.build({
            firstName,
            lastName,
            avatar: oauthUser.picture,
            birdhDate: "",
            addresses: [],
            email: oauthUser.email,
            username: oauthUser.username,
            gender: "male",
            permissionLevel: permission,
            phone: oauthUser.phone_number,
            password: "",
            status: 'active'
        });
        newUser.user_id = oauthUser.user_id;
        await newUser.save();
        return newUser;
    }

    /**
     * Creates an user instance in mongoose and in oauth0 api 
     * @param createUserDto new user data 
     * @returns created mongoose user 
     */
    async createUser(createUserDto:ICreateUserDTO){
        log("creating user");
        const session = await mongooseService.getMongoose().startSession();
        try{
            log("started transaction");
            session.startTransaction();
            const user = User.build(createUserDto);
            const oauthUser = await this.auth.createUser(
                fromUserDto(createUserDto)
            );
            user.user_id = oauthUser.user_id;
            await user.save();
            log("committing transaction");
            await session.commitTransaction();
            log("ending session");
            session.endSession();
            return user;
        }catch(err){
            log(err);
            log("abborting transaction");
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    }

    /**
     * Changes user password in mongoose and in oauth0 api 
     * @param user  user instance 
     * @param newPassword  user passwordd 
     */
    async updateUser(user:IUser,update:IPatchUserDTO){
       log("updating user data",update.permissionLevel);
       const session = await this.startMongooseSession();
       try{
        log("started transaction");
        session.startTransaction();
        log("updating user on oauth servers")
        await this.auth.updateUser(
            user.user_id,
            fromUserDto(update),
            update.permissionLevel
        );
        log("updating user data in mongoose");
        await user.set({...update});
        await user.save();
        log("commiting transaction");
        await session.commitTransaction();
        log("ending session");
        session.endSession();
        return user;
       }catch(err){
        log(err);
        log("abording transaction");
        await session.abortTransaction();
        session.endSession();
        throw err;
       }

    }

    async sendPasswordResetEmail(user:IUser) {
        log("invoked sent password reset email");
        return await this.auth.createPassowrdResetTicket(user);
    }

    async sentVerificationEmail(user:IUser) {
        log("invoked sent verification reset email");
        return await this.auth.createEmailVerificationTicket(user);
    }

    async deleteUserAccount(user:IUser){
        log("deleting user");
        const session = await mongooseService.getMongoose().startSession();
        try{
            log("started transaction");
            session.startTransaction();
            log("deleting oauth0 user from oauth0db");
            await this.auth.findAndRemoveUserByEmail(user.email);
            log("deleting user from mongoose db");
            await user.delete();
            log("commiting transaction");
            await session.commitTransaction();
            log("ending session");
        }catch(err){
            log(err);
            log("aborting transaction");
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    }

}

export default new UserService(authService);