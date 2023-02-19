import { IAddress } from "../models/adress.schema";
import { IPermissionLevel } from "../models/user.model";

export default interface ICreateUserDTO{
    firstName:string,
    lastName:string,
    gender:"male"|"female",
    permissionLevel:IPermissionLevel,
    email: string,
    phone: string,
    username:string,
    password:string,
    birdhDate:string,
    avatar:string,
    addresses:IAddress[],
    status:"active"|"closed"
}