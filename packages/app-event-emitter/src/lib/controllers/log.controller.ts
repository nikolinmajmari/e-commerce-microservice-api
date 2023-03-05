import { Request,Response } from "express";
import { IFilterDto } from "../dto/filter.dto";
import logService from "../services/log.service";
import debug from "debug";
import { clean } from "../common/utils";
const log = debug("app-event-emitter:controller:log");


export class LogController{

    async getLogs(req:Request,res:Response){
        log("get logs");
       const {group,method,sub,type} = req.query as IFilterDto;
       const logs = await logService.getLogs(clean({group,method,sub,type}));
       res.json(logs);
    }
}

export default new LogController();