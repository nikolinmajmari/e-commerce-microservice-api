import { IFilterDto } from "../dto/filter.dto";
import getLogModel, { ILogModel } from "../model/log.model";
import debug from "debug";
import { EventType } from "../common/types";
const log = debug("app:app-event-emmitter:services:log-service");

export class LogService{

    get model() { return getLogModel();}
    
    async getLogs(filter:IFilterDto){
        return this.model.find(filter);
    }

    /**
     * 
     * @returns 
     */
    async deleteMany(){
        await this.model.deleteMany({});
    }
}


export default new LogService();