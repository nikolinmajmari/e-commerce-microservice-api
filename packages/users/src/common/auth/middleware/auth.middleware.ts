import jwt_decode from 'jwt-decode';
import  debug from 'debug';
import Forbidden from '../../errors/http/forbidden_error';
import { NextFunction, Response } from 'express';
import AccessDenied from '../../errors/http/access_denied_error';
import { IRequest } from '../../types';
import authService from '../auth.service';
import usersService from '../../../services/users.service';
import { IPermissionLevel } from '../../../models/user.model';

const log = debug('app:auth:middleware');
const AUTHORIZATION_HEADER = 'authorization';
const BEARER = 'Bearer';
export const ROLES_KEY = `${process.env.AUTH_AUDIENCE}/roles`;

export const ROLES = {
    ADMIN: 'Admin',
    USER: 'User',
};


function isGranted(required:string,challange:string):boolean{
    if(challange===required){
        return true;
    }
    if(challange===ROLES.ADMIN){
        return true;
    }
    return false;
}
  

export function minimumPermissionRequired(permission:string){
    log("minimum permission required",permission);
    return (req,res:Response,next:NextFunction)=>{
        if(req.token && req.token[ROLES_KEY] && req.token[ROLES_KEY].find(role=>isGranted(permission,role))){
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
            req.user = await loadOrSignUpUser(req.token.sub);
            log("user loaded");
            next();
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
    const oauthUser = await authService.management.getUser({id});
    const roles = await authService.management.getUserRoles({id});
    const permissionLevel = roles.reduce((acc:any,next:any)=>{
        if(acc===null||(acc.length>1 && acc[1]!=="Admin")){
            return [next,next.name];
        }
        return acc;
        },null);
    const created = await usersService.createUserFromOauthUser(
        oauthUser,permissionLevel as unknown as IPermissionLevel
    );
    return created;
}