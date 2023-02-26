import {genSalt,hash,compare} from "bcrypt";
import { IUser } from "../models/user.model";



export async function hashPassword(password:string):Promise<string>{
    const salt = await genSalt(10);
    return hash(password,salt);
}

export async function isPasswordValid(user:IUser,password:string):Promise<boolean>{
    return compare(password,user.password);
}