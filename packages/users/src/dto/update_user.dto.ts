import { IAddress } from "../models/adress.schema";
import { IPermissionLevel } from "../models/user.model";

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
    addresses?:IAddress[],
    status?:"active"|"closed",
}
