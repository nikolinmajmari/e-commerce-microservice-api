import { IPermissionLevel } from "../models/user.model";
import ICreateUserDTO from "./create_user.dto";

export default interface ICreateOauthUserDTO{
    email:string,
    password:string,
    name?: string,
    picture?: string,
}

/// todo store all these metadata in auth0 database 
export interface IAuthAppMetadata{
    _id: string,
    email: string,
    user_id: string,
    username: string,
    phoneno: string,
    permissionLevel:IPermissionLevel,
    status:"active"|"closed"
}

export interface IAuthUserMetadata{
    firstName: string,
    lastName: string,
    gender:"male"|"female",
    birdhDate:string,
    avatar:string,
}


export function fromCreateUserDTO(
    dto:ICreateUserDTO
):ICreateOauthUserDTO{
    return {
        email: dto.email,
        name: `${dto.firstName} ${dto.lastName}`,
        password: dto.password
    }
}