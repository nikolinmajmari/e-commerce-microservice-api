import {auth as authJwt} from 'express-oauth2-jwt-bearer';
import jwt_decode from 'jwt-decode';
import  debug from 'debug';
import { Response } from 'express';

const log = debug('app:auth:middleware');
const AUTHORIZATION_HEADER = 'authorization';
const BEARER = 'Bearer';
export const ROLES_KEY = `${process.env.AUTH_CLAIM}/roles`;

export const ROLES = {
    ADMIN: 'Admin',
    USER: 'User',
};


export const checkJwt = authJwt({
    audience: process.env.AUTH_AUDIENCE,
    issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
});  

export async function isAdmin(req,res:Response,next){
    try{
        if(req.headers[AUTHORIZATION_HEADER] && req.headers[AUTHORIZATION_HEADER].indexOf(BEARER)> -1){
            log("decoding token");
            req.token = jwt_decode(req.headers[AUTHORIZATION_HEADER].split(BEARER)[1]);
            if(!hasAdminPermission(req.token)){
                throw new Error("Admin permission required");
            }
            log('token decoded');
            return next();
        }else{
            throw new Error("Authorization header, Bearer scheme missing");
        }
    }catch(e){
        next(e);
    }
}


export default function auth(){
    return [checkJwt,isAdmin];
}

function hasAdminPermission(token){
    return(
        token 
        && token[ROLES_KEY] 
        && token[ROLES_KEY]
        .find(
            role=>role==ROLES.ADMIN
        ));
}