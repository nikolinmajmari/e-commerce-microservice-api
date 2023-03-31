import {AppEventEmitter,UsersLogGroup} from "@repo/app-event-emitter";
import { Request } from "express";
import { IUser } from "../models/user.model";
import kafka from "./kafka";
import debug from "debug";

const log = debug("app:common:event-emitter");

const emitter = new AppEventEmitter(kafka);

export class EventEmitterService{

    constructor(private emitter:AppEventEmitter){}

    async logRequest(req){
        const url = new URL(req.url, `http://${req.headers.host}`);
        return this.emitter.produceAppRequestEvent({
           headers: req.headers,
           identifier: req.identifier,
           method: req.method,
           path: url.pathname + url.search,
           host: url.host,
        })
    }

    async logAction(
        group: UsersLogGroup,
        user:IUser,
        req,
        message: string
      ){
        const url = new URL(req.url, `http://${req.headers.host}`);
        const body = {...req.body};
        delete body.password;
        return this.emitter.produceAppActionEvent(
            {
                headers: req.headers,
                host: url.host,
                identifier: req.identifier,
                method: req.method,
                path: url.pathname,
                sub: user.user_id,
                context: "users",
                group: group,
                message: message,
                payload: body
            }
        )
    }

    async logAnonymousAction(
        group: UsersLogGroup,
        req,
        message: string
    ){
        const url = new URL(req.url, `http://${req.headers.host}`);   
        const body = {...req.body};
        delete body.password;
        return this.emitter.produceAppActionEvent(
            {
                headers: req.headers,
                host: url.host,
                identifier: req.identifier,
                method: req.method,
                path: url.pathname,
                context: "users",
                group: group,
                message: message,
                payload: body
            }
        )
    }

    async logUserChangeEmailAction(req){
        const user:IUser = req.user;
        this.logAction(
            UsersLogGroup.CHANGE_EMAIL,
            user,
            req,
            `User ${user.fullName} changed email to ${req.body.email}`
        );
    }

    async logUserPasswordChange(req){
        const user:IUser = req.user;
        this.logAction(
            UsersLogGroup.CHANGE_PASSWORD,
            user,
            req,
            `User ${user.fullName} changed password `
        )
    }

    async logUserProfileUpdate(req){
        const user:IUser = req.user;
        this.logAction(
            UsersLogGroup.PROFILE_UPDATE,
            user,
            req,
            `User ${user.fullName} updated profile`
        );
    }

    async logUserClosesAccount(req){
        const user:IUser = req.user;
        this.logAction(
            UsersLogGroup.CLOSE_ACCOUNT,
            user,
            req,
            `User ${user.fullName} closed his account`
        );
    }

    async logUserResetPassword(req){
        const user:IUser = req.user;
        this.logAction(
            UsersLogGroup.RESET_PASSWORD,
            user,
            req,
            `User ${user.fullName} requested a password reset`
        );
    }

    async logUserLogin(req){
        const user:IUser = req.user;
        this.logAction(
            UsersLogGroup.USER_LOGIN,
            user,req,
            `User ${user.fullName} logged in`
        )
    }

    async logUserLogOut(req){
        const user:IUser = req.user;
        this.logAction(
            UsersLogGroup.USER_LOGOUT,
            user,
            req,
            `User ${user.fullName} logged out`
        );
    };

}

export default new EventEmitterService(emitter);