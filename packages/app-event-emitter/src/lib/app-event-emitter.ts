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
  PASSWORD_RESET="PASSWORD_RESET",
  EMAIL_CHANGE="EMAIL_CHANGE",
  USER_LOGIN="USER_LOGIN",
  USER_LOGOUT="USER_LOGOUT",
  EMAIL_CHANGED="EMAIL_CHANGED"
}


/**
 * 
 */
export class AppEventEmitter{
  private initialized:boolean;
  private emitter:EventEmitter;
  constructor(private config:IAppEventEmitterConfig){
    this.initialized = false;
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
    this.emitter.on(EventType.EMAIL_CHANGE,this.saveEvent);
    this.emitter.on(EventType.PASSWORD_RESET,this.saveEvent);
    this.emitter.on(EventType.USER_LOGIN,this.saveEvent);
    this.emitter.on(EventType.USER_LOGOUT,this.saveEvent);
  }

  async saveEvent(data:ILogDto){
    const log = Log().build(data);
    await log.save();
  }


  async emitRequestEvent(request: Request){
    this.emitter.emit(EventType.API_REQUEST,{
      identifier: request["id"],
      type: LogType.API_REQUEST,
      group: typeof request,
      sub: null,
      headers: JSON.stringify(request.headers),
      method: request.method,
      uri: request.url,
      payload: JSON.stringify(request.body),
      message: `An api request with id ${request["id"]} was performed on ${request.url}`
    } as ILogDto)
  }

  async emitUserLoginEvent(user:ObjectWithId,request: Request){
    this.emitter.emit(EventType.API_REQUEST,{
      identifier: request["id"],
      type: LogType.API_REQUEST,
      group: typeof user,
      sub: user?.user_id??user._id,
      headers: JSON.stringify(request.headers),
      method: request.method,
      uri: request.url,
      payload: JSON.stringify(request.body),
      message: `An api request with id ${request["id"]} was performed on ${request.url}`
    } as ILogDto)
  }

  async emitPasswordChangeEvent(user:ObjectWithId,request: Request){
    this.emitter.emit(EventType.API_REQUEST,{
      identifier: request["id"],
      type: LogType.API_REQUEST,
      group: typeof user,
      sub: user?.user_id??user._id,
      headers: JSON.stringify(request.headers),
      method: request.method,
      uri: request.url,
      payload: JSON.stringify(request.body),
      message: `User ${user.user_id??user._id} performed a password change request`
    } as ILogDto)
  }
}

export interface IAppEventEmitterConfig{
  mongooseUrl: string,
}