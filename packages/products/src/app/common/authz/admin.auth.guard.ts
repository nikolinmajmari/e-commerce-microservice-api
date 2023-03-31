

import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';


const ROLE_ADMIN = 'Admin';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const rolesKey = `${process.env.AUTH_CLAIM}/roles`;
    // this is just a test, you can change based on your needs.
    const user = context.getArgs()[0].user;
    if(!user){
        throw new UnauthorizedException();
    }
    const roles = user[rolesKey];
    // do something with the user here.
    Logger.log(user,"user is here");
    return roles && roles.find((value) => value === ROLE_ADMIN);
  }
}


@Injectable()
export class AdminGQLAuthGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const rolesKey = `${process.env.AUTH_CLAIM}/roles`;
    // this is just a test, you can change based on your needs.
    const user = this.getRequest(context).user;
    if(!user){
        throw new UnauthorizedException();
    }
    const roles = user[rolesKey];
    // do something with the user here.
    Logger.log(user,"user is here");
    return roles && roles.find((value) => value === ROLE_ADMIN);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
