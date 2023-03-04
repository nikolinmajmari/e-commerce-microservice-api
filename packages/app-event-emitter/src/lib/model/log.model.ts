import {Model, Schema} from "mongoose";
import mongooseService from "../common/mongoose.service";
import { ILogDto } from "../dto/log.dto";

export enum LogType{
    API_REQUEST="API_REQUEST",
    APP_ACTION="APP_ACTION",
}


export interface ILog extends Document{
    [x: string]: any;
    identifier:string,
    type?: LogType,
    sub?: string,
    group?: string,
    message?: string,
    /// request information
    payload?: string,
    headers?:string,
    method?:string,
    uri?:string
}

export interface ILogModel extends Model<ILog>{
    build(dto:ILogDto):ILog;
}

const logSchema = new Schema({
    identifier: String,
    type: {
        type: String,
        enum: [LogType.API_REQUEST,LogType.APP_ACTION]
    },
    sub: String,
    group: String,
    message: String,
    payload: String,
    headers: String,
    method: String,
    uri: String,
},{
    timestamps:{
        createdAt: true,
    },
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

logSchema.statics.build = function(dto: ILogDto):ILog{
    const model = getLogModel();
    return new model(dto);
}

let _model:ILogModel|undefined;

const getLogModel = ()=>{
    if(_model===undefined){
        _model = mongooseService.getConnection().model<ILog,ILogModel>("log",logSchema);
    }
    return mongooseService.getConnection().model<ILog,ILogModel>("log",logSchema);
    return _model;
};
export default getLogModel;