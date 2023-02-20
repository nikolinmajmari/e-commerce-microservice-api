import { IAccountStatus } from "../models/user.model";
import { IUpdateUserDto } from "./update_user.dto";

export default interface IUpdateOauthUserDTO{
    email?:string,
    password?:string,
    name?: string,
    picture?: string,
    status?: IAccountStatus,
}


export function fromUpdateUserDTO(
    dto:IUpdateUserDto
):IUpdateOauthUserDTO{
    return {
        email: dto?.email??undefined,
        name: `${dto?.firstName} ${dto?.lastName}`,
        password: dto?.password??undefined,
        status: dto.status
       // picture: dto?.avatar??undefined,
    }
}