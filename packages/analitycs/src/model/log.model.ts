import { LogGroup, Topic } from "@repo/app-event-emitter";
import { Model } from "mongoose";
import mongooseService from "../common/mongoose.service";
import { ILogDto } from "../dto/log.dto";

const mongoose = mongooseService.getMongoose();


export interface ILog extends Document{
    identifier:string,
    topic?: Topic,
    group?: LogGroup,
    sub?: string,
    message?: string,
    payload?: string,
    headers?:string,
    method?:string,
    host?: string,
    path?:string,
}

export interface ILogModel extends Model<ILog>{
    build(dto:ILogDto):ILog;
}

const logSchema = new mongoose.Schema({
    identifier: String,
    type: {
        type: String,
        enum: [Topic.API_REQUEST,Topic.APP_ACTION]
    },
    sub: String,
    group: String,
    message: String,
    payload: String,
    headers: String,
    method: String,
    path: String,
    host: String,
},{
    timestamps:{
        createdAt: true,
    },
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

logSchema.statics.build = function(dto: ILogDto):ILog & Document{
    return new Log(dto);
}

const Log = mongoose.model<ILog,ILogModel>("log",logSchema)

export default Log;