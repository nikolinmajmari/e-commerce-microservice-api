import {Application} from 'express';
import {auth, ConfigParams} from 'express-openid-connect'
import {auth as authJwt} from 'express-oauth2-jwt-bearer'

export const checkJwt = authJwt({
    audience: process.env.AUTH_AUDIENCE,
    issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
    secret:null,
});  
  

export class AuthConfigService{
    constructor(private app:Application){}
    config(){
        const config:ConfigParams = {
            authRequired: false,
            auth0Logout: true,
            secret: process.env.SECRET,
            baseURL: process.env.BASE_URL,
            clientID: process.env.AUTH_CLIENT_ID,
            clientSecret:process.env.AUTH_CLIENT_SECRET,
            issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
            // routes:{
            //     login: false,
            //     callback:"/profile"
            // },
            authorizationParams: {
                response_type: 'code', // This requires you to provide a client secret
                audience: process.env.AUTH_AUDIENCE,
                scope: "openid email profile name",
            },        
        };
        
        this.app.use(auth(config));
    }
}

