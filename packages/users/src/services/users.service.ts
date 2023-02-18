import authService from "../common/auth/auth.service";
import ICreateUserDTO from "../dto/create_user.dto";
import User, { IUser } from "../models/user.model";

export class UserService{

    async getUserById(id:string){
        return await User.findById(id);
    }


    async createUser(createUserDto:ICreateUserDTO){
        const oauthUser = await authService.createUser(createUserDto);
        const user = User.build(createUserDto);
        user.user_id = oauthUser.user_id;
        await user.save();
        return user;
    }

    async changeUserPassord(user:IUser,newPassword:string){
        authService.changePassword(user.user_id,newPassword);
        user.password = newPassword;
        await user.save();
    }

    async sendPasswordResetEmail(user:IUser) {
        await authService.sendPasswordResetEmailTo(user);
    }

    async deleteUserAccount(user:IUser){
       // await authService.findAndRemoveUserByEmail(user.email);
        await user.delete();
    }

    async updateUserProfile(user:IUser){
        //
    }

}

export default new UserService();