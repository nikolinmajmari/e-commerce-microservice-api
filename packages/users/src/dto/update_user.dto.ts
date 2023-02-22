import { IAddress } from "../models/adress.schema";
import { IAccountStatus, IPermissionLevel } from "../models/user.model";

export interface IUpdateUserDto{
    permissionLevel?:IPermissionLevel;
    firstName?:string,
    lastName?:string,
    gender?:"male"|"female",
    email?: string,
    phone?: string,
    username?:string,
    password?:string,
    birthDate?:string,
    avatar?:string,
    status?:IAccountStatus,
}
