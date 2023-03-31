

import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from '@nestjs/core';


@Injectable()
export class RegisteredUserAuthGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const metadataKey = `${process.env.AUTH_CLAIM}/app_metadata`;
    // this is just a test, you can change based on your needs.
    const user = context.getArgs()[0].user;
    Logger.log(Object.keys(context.getArgs()[0]));
    if(!user){
        throw new UnauthorizedException();
    }
    const metadata = user[metadataKey];

    return metadata && metadata["id"];
  }
}
