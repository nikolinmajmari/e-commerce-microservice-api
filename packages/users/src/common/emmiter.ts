import {AppEventEmitter} from "@repo/app-event-emitter";
import debug from "debug";

const mongooseURL = process.env.MONGODB_URL || 'mongodb://localhost/logs-repository';
const log = debug("app:common:emitter");


const emitter = new AppEventEmitter({
    mongooseUrl: mongooseURL
});

enum UserEventsGroup  {
    RESET_PASSWORD="RESET_PASSWORD",
    CHANGE_PASSWORD="CHANGE_PASSWORD",
    CHANGE_EMAIL="CHANGE_EMAIL",
    CLOSE_ACCOUNT="CLOSE_ACCOUNT",
    PROFILE_UPDATE="PROFILE_UPDATE",
    USER_LOGIN="USER_LOGIN",
    USER_LOGOUT="USER_LOGOUT"
}

export class UsersEventEmmitter {
    private emitter: AppEventEmitter
    
    constructor(emitter: AppEventEmitter){
        this.emitter = emitter;
    }

    private emitUserEvent(
        user:any,
        params:{
            group:UserEventsGroup,
            req?,headers?,body?,
            message,
        }){
        const {group,req,headers,body,message} = params;
        this.emitter.emitApiActionEvent({
            identifier: (req as unknown)["identifier"],
            context: "user",
            group: group,
            sub: user?._id,
            payload: body,
            headers: headers,
            message: message??`User event of ${group} group `,
            method: req.method,
            uri: req.url
        })
    }

    emitUserLoginEvent(req){
        this.emitUserEvent(req.user,{
            group: UserEventsGroup.USER_LOGIN,
            message: "User logged int",
            headers: req.headers,
            req: req
        })
    }

    emitUserProfileUpdateEvent(req){
        this.emitUserEvent(req.user,{
            group: UserEventsGroup.PROFILE_UPDATE,
            req: req,
            message: `User updated profile`,
            body: req.body,
            headers: req.headers
        })
    }

    emitPasswordResetEvent(req){
        this.emitUserEvent(req.user,{
            group: UserEventsGroup.RESET_PASSWORD,
            message: `User reseted password via ticket email`,
            req: req,
            body: req.body,
            headers: req.headers,
        })
    }
    
    emitPasswordChangeEvent(req){
        this.emitUserEvent(req.user,{
            group: UserEventsGroup.CHANGE_PASSWORD,
            message: `User changed  password`,
            req: req,
            headers: req.headers,
        })
    }

    emitEmailChangeEvent(req){
        this.emitUserEvent(req.user,{
            group: UserEventsGroup.CHANGE_PASSWORD,
            message: `User changed  password`,
            req: req,
            headers: req.headers,
            body: req.body,
        })
    }

    emitCloseUserAccount(req){
        this.emitUserEvent(req.user,{
            group: UserEventsGroup.CLOSE_ACCOUNT,
            message: "User closses account",
            body: req.body,
            headers: req.headers,
            req: req
        })
    }

    emitUserLogoutEvent(req){
        this.emitUserEvent(req.user,{
            group: UserEventsGroup.USER_LOGOUT,
            message: "User logged out",
            body: req.body,
            headers: req.headers,
            req: req
        })
    }
}


export default new UsersEventEmmitter(emitter);
export {emitter};