import { EventEmitter } from "stream";


export enum AppEvent{

}

export default class AppEventEmitter extends EventEmitter{
  constructor(){
    super();
  }

  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
      return super.on(eventName,listener);
  }

  emit(eventName: string | symbol, ...args: any[]): boolean {
      return super.emit(eventName,...args);
  }
}