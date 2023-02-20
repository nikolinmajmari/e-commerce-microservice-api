import { IAddress } from "../models/adress.schema";
import { IAccountStatus, IPermissionLevel } from "../models/user.model";

export default interface IPatchUserDTO{
    firstName?:string;
    lastName?:string;
    gender?:"male"|"female";
    permissionLevel?: IPermissionLevel;
    email?: string;
    phone?:string;
    username?:string;
    password?:string;
    birthDate?:string;
    avatar?:string;
    status?:IAccountStatus,
    addresses?:IAddress[]
}