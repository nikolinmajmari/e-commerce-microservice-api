import { IAddress } from "../models/adress.schema";

export default interface IUpdateUserProfileDto{
    firstName?:string,
    lastName?:string,
    gender?:"male"|"female",
    phone?: string,
    birthDate?:string,
    avatar?:string,
    adresses?:IAddress[]
}