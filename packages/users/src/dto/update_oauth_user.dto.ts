import { IUpdateUserDto } from "./update_user.dto";

export default interface IUpdateOauthUserDTO{
    email?:string,
    password?:string,
    name?: string,
    picture?: string,
}


export function fromUpdateUserDTO(
    dto:IUpdateUserDto
):IUpdateOauthUserDTO{
    return {
        email: dto?.email??undefined,
        name: `${dto?.firstName} ${dto?.lastName}`,
        password: dto?.password??undefined,
       // picture: dto?.avatar??undefined,
    }
}