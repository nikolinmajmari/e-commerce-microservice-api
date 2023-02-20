import authService from "../common/auth/auth.service";
import ICreateUserDTO from "../dto/create_user.dto";
import { ListUsersInput } from "../dto/list_user.input";
import User, { IUser } from "../models/user.model";
import debug from "debug";
import mongooseService from "../common/mongoose";
import { fromCreateUserDTO } from "../dto/create_oauth_user.dto";
import IPatchUserDTO from "../dto/patch_user_dto";
import { fromUpdateUserDTO } from "../dto/update_oauth_user.dto";
import { IAuth0Service } from "../common/auth/auth.types";
import { IAddress } from "../models/adress.schema";
import INewAddressDTO from "../dto/new_address.dto";
import IPatchAddressDTO from "../dto/patch_address.dto";
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
    async getUserById(id:string){
        const user =  await User.findById(id);
        return user;
    }

    async getUserAddress(user:IUser,address:string):Promise<IAddress>{
        return user.addresses.find((addr)=>addr._id == address);
    }

    async addUserAddress(user:IUser,address:INewAddressDTO){
        if(address.primary){
            this.setAllAddressesAsNonPrimary(user);
        }
        const index = user.addresses.push({...address});
        await user.save();
        return user.addresses[index];
    }

    async patchUserAddress(user:IUser,address:IAddress,patch:IPatchAddressDTO){
        if(patch.primary===true && address.primary===false){
            this.setAllAddressesAsNonPrimary(user);
        }
        address.set(patch);
        await user.save();
        return address;
    }
    
    private async setAllAddressesAsNonPrimary(user:IUser){
        for(const subdoc of user.addresses){
            subdoc.set({primary:false});
        }
        user.save();
    }

    async deleteUserAddress(user:IUser,address:IAddress){
        user.addresses.pull(address);
        await user.save();
    }

    async getAllUserDataById(id:string){
        const userDoc = await this.getUserById(id);
        log(userDoc);
        const oauthUser  = await this.auth.findUserByEmail(userDoc.email);
        return {
            ...userDoc.toJSON(),
            email_verified:oauthUser.email_verified,
        }
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
                fromCreateUserDTO(createUserDto),
                createUserDto.permissionLevel
            );
            user.user_id = oauthUser.user_id;
            await user.save();
            log("committing transaction");
            await session.commitTransaction();
            log("ending session");
            session.endSession();
            return {id: user.id};
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
            fromUpdateUserDTO(update),
            update.permissionLevel
        );
        log("updating user data in mongoose");
        await user.set({...update});
        await user.save();
        log("commiting transaction");
        await session.commitTransaction();
        log("ending session");
        session.endSession();
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
        return await this.auth.sendPasswordResetEmailTo(user);
    }

    async sentVerificationEmail(user:IUser) {
        log("invoked sent verification reset email");
        return await this.auth.sentEmailVerification(user);
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
        await user.delete();
    }

    async updateUserProfile(user:IUser){
        //
    }

}

export default new UserService(authService);