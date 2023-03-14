import { EventEmitter } from "stream";
import mongooseService from "./common/mongoose.service";
import debug from "debug";
import { IApiAction, IApiRequest } from "./dto/log.dto";
import getLogModel from "./model/log.model";
import {  EventType } from "./common/types";
const log=debug("package:app-event-emitter:core");

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

  async configure(){
    await mongooseService.connect(this.config.mongooseUrl);
    this.emitter.on(EventType.API_REQUEST,this.handleApiRequestEvent);
    this.emitter.on(EventType.API_ACTION,this.handleApiActionEvent);
  }

  async handleApiRequestEvent(data:IApiRequest){
    const logDoc = getLogModel().build({
      identifier: data.identifier,
      method: data.method,
      group: "",
      headers: JSON.stringify(data.headers??"{}"),
      uri: data.url,
      message: `Api access, from request with identifier ${data.identifier} on url ${data.url}`,
      type:EventType.API_REQUEST,
    });
    await logDoc.save();
  }


  async handleApiActionEvent(data:IApiAction){
    const logDoc = getLogModel().build({
      identifier: data.identifier,
      context: data.context,
      sub: data.sub,
      group: data.group,
      message: data.message,
      headers: JSON.stringify(data.headers),
      method: data.method,
      payload: JSON.stringify(data.payload??"{}"),
      type: EventType.API_ACTION,
    });
    await logDoc.save()
  }


  async emitApiRequestEvent(data:IApiRequest){
    this.emitter.emit(EventType.API_REQUEST,data);
  }

  async emitApiActionEvent(data:IApiAction){
    this.emitter.emit(EventType.API_ACTION,data);
  }
 
}

export interface IAppEventEmitterConfig{
  mongooseUrl: string,
}