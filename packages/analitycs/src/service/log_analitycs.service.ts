import { Topic } from "@repo/app-event-emitter";
import debug from "debug";
import { IActionLogDto, IRequestLogDto } from "@repo/app-event-emitter";
import { IFilterDto } from "../dto/filter.dto";
import Log from "../model/log.model";


const logger = debug("app:analitycs:services:log-service");

export class LogService{

    
    async getLogs(filter:IFilterDto){
        return Log.find(filter);
    }

    /**
     * 
     * @returns 
     */
    async deleteMany(){
        await Log.deleteMany({});
    }

    async saveActionLog(dto:IActionLogDto){
        logger("got action log",dto);
        const {
            headers,host,identifier,method,path,context,group,message,payload,sub
        } = dto;
        const log = new Log({
            type: Topic.APP_ACTION, 
            headers,host,identifier,method,path,group,message,payload,sub
        });
        await log.save();
        return log;
    }

    async saveRequestLog(dto:IRequestLogDto){
        logger("got request log",dto);
        const {
            headers,host,identifier,method,path
        } = dto;
        const log = new Log({
            headers,host,identifier,method,path
        });
        await log.save();
        return log;
    }
}


export default new LogService();