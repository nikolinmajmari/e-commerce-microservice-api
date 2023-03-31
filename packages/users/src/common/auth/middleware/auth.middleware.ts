import jwt_decode from 'jwt-decode';
import  debug from 'debug';
import Forbidden from '../../errors/http/forbidden_error';
import { NextFunction, Response } from 'express';
import AccessDenied from '../../errors/http/access_denied_error';
import { IRequest } from '../../types';
import authService from '../auth.service';
import usersService from '../../../services/user.service';
import { IPermissionLevel } from '../../../models/user.model';
import emmiter from '../../event_emitter.service';

const log = debug('app:auth:middleware');
const AUTHORIZATION_HEADER = 'authorization';
const BEARER = 'Bearer';
export const ROLES_KEY = `${process.env.AUTH_CLAIM}/roles`;

export const ROLES = {
    ADMIN: 'Admin',
    USER: 'User',
};




function isGranted(required:string,challange:string):boolean{
    log("is granted ",required,challange);
    if(challange===required){
        return true;
    }
    if(challange===ROLES.ADMIN){
        return true;
    }
    return false;
}
  
function checkToken(token,permission){
    return token && (
        (token[ROLES_KEY] && token[ROLES_KEY].find(role=>isGranted(permission,role)))
        ||
        (token.role && isGranted(permission,token.role))
    );
}

export function minimumPermissionRequired(permission:string){
    log("minimum permission required",permission);
    return (req,res:Response,next:NextFunction)=>{
        if(checkToken(req.token,permission)){
            log("user can perform action to",req.originalUrl);
            next();
        }else{
            log("user can not perform action");
            next(new AccessDenied("Access denied"));
        }
    }
}

export function isAdmin(){
    return minimumPermissionRequired(ROLES.ADMIN);
}

export function isUser(){
    return minimumPermissionRequired(ROLES.USER);
}



export async function extractUserMiddleware(req:IRequest,res,next){
    if(req.headers[AUTHORIZATION_HEADER] && req.headers[AUTHORIZATION_HEADER].indexOf(BEARER)> -1){
        try{
            log("decoding token");
            req.token = jwt_decode(req.headers[AUTHORIZATION_HEADER].split(BEARER)[1]);
            log('token decoded');
            log("loading user");
            if(checkToken(req.token,ROLES.USER)){
                req.user = await loadOrSignUpUser(req.token.sub);
                log("user loaded");
                return next();
            }
            throw new AccessDenied("You do not have proper roles/permission to access this api");
        }catch(e){
            next(e);
        }
    }else{
        next(new Forbidden("Authorization Header missing"));
    }
}
async function loadOrSignUpUser(id:string){
    const found = await usersService.getUserByUserId(id);
    if(found!==null){
        return found;
    }
    log("user id to check",id);
    const oauthUser = await authService.management.getUser({id});
    const roles = await authService.management.getUserRoles({id});
    
    const permissionLevel = roles.reduce((acc:any,next:any)=>{
        if(acc===null ||(acc&& acc.length>1 && acc[1]!==ROLES.ADMIN)){
            return [next,next.name];
        }
        return acc;
        },null);
    const created = await usersService.createUserFromOauthUser(
        oauthUser,permissionLevel[1] as unknown as IPermissionLevel
    );
    return created;
}