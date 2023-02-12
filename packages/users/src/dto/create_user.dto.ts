import { IAddress } from "../models/adress.schema";

export default interface ICreateUserDTO{
    firstName:string,
    lastName:string,
    gender:"male"|"female",
    email: string,
    phone: string,
    username:string,
    password:string,
    birdhDate:string,
    avatar:string,
    addresses:IAddress[],
    status:"active"|"closed",
    createdAt:number,
    modifiedAt:number,
}
