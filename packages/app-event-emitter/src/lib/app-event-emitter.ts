import { EventEmitter } from "stream";
import mongooseService from "./common/mongoose.service";
import {Request} from "express";
import debug from "debug";
import { ILogDto } from "./dto/log.dto";
import Log,{ LogType } from "./model/log.model";
import {  ObjectWithId } from "./common/types";
const log=debug("package:app-event-emitter:core");

export enum EventType{
  API_REQUEST="API_REQUEST",
  PASSWORD_CHANGE="PASSWORD_CHANGE",
  EMAIL_CHANGE="EMAIL_CHANGE",
  USER_LOGIN="USER_LOGIN",
  USER_LOGOUT="USER_LOGOUT",
  PROFILE_UPDATE="PROFILE_UPDATE",
  CLOSE_ACCOUNT="CLOSE_ACCOUNT",
}


/**
 * 
 */
export class AppEventEmitter{
  private emitter:EventEmitter;
  constructor(private config:IAppEventEmitterConfig){
    this.emitter = new EventEmitter({
      captureRejections: true
    });
  }

  /**
   * 
   */
  async configure(){
    await mongooseService.connect(this.config.mongooseUrl);
    this.emitter.on(EventType.API_REQUEST,this.saveEvent);
    this.emitter.on(EventType.CLOSE_ACCOUNT,this.saveEvent);
    this.emitter.on(EventType.EMAIL_CHANGE,this.saveEvent);
    this.emitter.on(EventType.PASSWORD_CHANGE,this.saveEvent);
    this.emitter.on(EventType.PROFILE_UPDATE,this.saveEvent);
    this.emitter.on(EventType.USER_LOGIN,this.saveEvent);
    this.emitter.on(EventType.USER_LOGOUT,this.saveEvent);
  }

  async saveEvent(data:ILogDto){
    log(data.identifier);
    const logDoc = Log().build(data);
    await logDoc.save();
  }


  async emitRequestEvent(request: Request, ignoreBody=false){
    this.emitter.emit(EventType.API_REQUEST,{
      identifier: request["identifier"],
      type: LogType.API_REQUEST,
      group: typeof request,
      sub: null,
      headers: JSON.stringify(request.headers),
      method: request.method,
      uri: request.url,
      payload: ignoreBody?null:JSON.stringify(request.body),
      message: `An api request with id ${request["id"]} was performed on ${request.url}`
    } as ILogDto)
  }

  async emitUserLoginEvent(user:ObjectWithId,request: Request){
    this.emitter.emit(EventType.API_REQUEST,{
      identifier: request["identifier"],
      type:  LogType.APP_ACTION,
      group: typeof user,
      sub: user?.user_id??user._id,
      headers: JSON.stringify(request.headers),
      method: request.method,
      uri: request.url,
      payload: JSON.stringify(request.body),
      message: `User ${user._id} Just performed an login${request.url}`
    } as ILogDto)
  }

  async emitPasswordChangeEvent(user:ObjectWithId,request: Request){
    this.emitter.emit(EventType.API_REQUEST,{
      identifier: request["id"],
      type:  LogType.APP_ACTION,
      group: typeof user,
      sub: user?.user_id??user._id,
      headers: JSON.stringify(request.headers),
      method: request.method,
      uri: request.url,
      payload: null,
      message: `User ${user.user_id??user._id} performed a password change request`
    } as ILogDto)
  }

  async emmitEmailChangeEvent(user: ObjectWithId,request: Request){
    this.emitter.emit(EventType.PROFILE_UPDATE,{
      type: LogType.APP_ACTION,
      identifier: request["identifier"],
      context: "user",
      sub: user.user_id??user._id,
      group: typeof user,
      headers: JSON.stringify(request.headers),
      message:  `User ${user} changed his/her email address`,
      method: request.method,
      uri: request.url,
      payload: JSON.stringify(request.body),
    }as ILogDto)
  }
  async emmitCloseAccountEvent(user: ObjectWithId,request: Request){
    this.emitter.emit(EventType.CLOSE_ACCOUNT,{
      type:  LogType.APP_ACTION,
      identifier: request["identifier"],
      context: "user",
      sub: user.user_id??user._id,
      group: typeof user,
      headers: JSON.stringify(request.headers),
      message:  `User ${user} closed account`,
      method: request.method,
      uri: request.url,
      payload: null,
    }as ILogDto)
  }

  async emmitProfileUpdateEvent(user: ObjectWithId,request: Request){
    this.emitter.emit(EventType.PROFILE_UPDATE,{
      type:  LogType.APP_ACTION,
      identifier: request["identifier"],
      context: "auth",
      sub: user.user_id??user._id,
      group: typeof user,
      headers: JSON.stringify(request.headers),
      message:  `Profile updated by ${user}`,
      method: request.method,
      uri: request.url,
      payload: JSON.stringify(request.body),
    }as ILogDto)
  }
}

export interface IAppEventEmitterConfig{
  mongooseUrl: string,
}