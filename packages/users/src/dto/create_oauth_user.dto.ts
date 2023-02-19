import ICreateUserDTO from "./create_user.dto";

export default interface ICreateOauthUserDTO{
    email:string,
    password:string,
    name?: string,
    picture?: string,
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