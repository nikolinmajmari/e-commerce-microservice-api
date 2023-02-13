import mongoose, { Schema,Document,Model } from "mongoose";
import ICreateUserDTO from "../dto/create_user.dto";
import schema, { IAddress } from "./adress.schema";

export type IPermissionLevel = "Admin"|"User";

export interface IUser extends Document{
    id: string,
    permissionLevel:IPermissionLevel;
    firstName:string,
    lastName:string,
    gender:"male"|"female",
    email: string,
    phone: string,
    username:string,
    password:string,
    birthDate:string,
    avatar:string,
    addresses:IAddress[],
    status:"active"|"closed",
    createdAt:number,
    modifiedAt:number,
}

interface IUserModel extends Model<IUser>{
    build(dto:ICreateUserDTO);
}

const userSchema = new Schema({
    permissionLevel : String,
    firstName : String,
    lastName : String,
    gender : {
        type: String,
        enum: [ "male","female"]
    },
    email : String,
    phone : String,
    username: String,
    password: String,
    birthDate: String,
    avatar: String,
    addresses: [schema]
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});
userSchema.statics.build = (dto:ICreateUserDTO)=>{
    return new User(dto);
};

userSchema.index({email:1},{unique:true});

userSchema.pre("save",async function (done){
    if(this.isModified("password")){
        /// hash the password with password hasher
        /// this.set("password",hashed);
    }
    done();
})

const User = mongoose.model<IUser,IUserModel>("User",userSchema);

export default User;