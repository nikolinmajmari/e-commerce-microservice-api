import { Request } from "express";
import { IUser } from "../models/user.model";


export interface IRequest extends Request{
    user?:IUser,
    token?:{[key:string]:any};
}