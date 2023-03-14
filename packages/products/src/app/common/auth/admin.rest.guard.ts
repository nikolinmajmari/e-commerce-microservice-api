import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";


const ROLE_ADMIN = 'admin';


@Injectable()
export class AdminRestGuard implements CanActivate{

    constructor(protected readonly reflector: Reflector,private configService:ConfigService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
        const rolesNamespace = `${this.configService.get<string>("AUTH_CLAIM")}/roles`;
        
        const user = context.getArgs()[0].user;

        const roles = user[rolesNamespace];

        return roles && roles.find(role=>role==ROLE_ADMIN);
    }

}