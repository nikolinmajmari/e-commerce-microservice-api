import mongoose, { Schema,Document,Model, Types } from "mongoose";
import ICreateUserDTO from "../dto/create_user.dto";
import { hashPassword } from "../services/hasher";
import schema, { IAddress } from "./adress.schema";

export type IPermissionLevel = "Admin"|"User";
export type IAccountStatus = "active"|"closed";

export interface IUser extends Document{
    id: string,
    user_id:string,
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
    addresses:Types.DocumentArray<IAddress>,
    status:IAccountStatus,
    createdAt:number,
    modifiedAt:number,
}

interface IUserModel extends Model<IUser>{
    build(dto:ICreateUserDTO):IUser;
}

const userSchema = new Schema({
    permissionLevel : {
        type: String,
        enum: [ "Admin","User"]
    },
    firstName : String,
    lastName : String,
    gender : {
        type: String,
        enum: [ "male","female"]
    },
    email : String,
    phone : String,
    user_id: {
        type:String,
        immutable: true
    },
    username: String,
    password: String,
    birthDate: String,
    avatar: String,
    status:{
        type: String,
        enum: ["active","closed"],
        require: true,
        default: "active",
    },
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
        this.set("password",await hashPassword(this.get("password")))
    }
    done();
})

const User = mongoose.model<IUser,IUserModel>("User",userSchema);

export default User;