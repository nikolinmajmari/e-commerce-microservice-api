import { IAddress } from "../models/adress.schema";
import { IPermissionLevel } from "../models/user.model";
import INewAddressDTO from "./new_address.dto";

export default interface ISignUpUserDTO{
    firstName:string,
    lastName:string,
    gender:"male"|"female",
    email: string,
    phone: string,
    username:string,
    password:string,
    birdhDate:string,
    avatar:string,
    addresses:INewAddressDTO[],
    status:"active"|"closed"
}