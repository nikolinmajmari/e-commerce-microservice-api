import { Request,Response } from "express";
import logAnalitycsService from "../service/log_analitycs.service";
import debug from "debug";
import { clean } from "../common/utils";
import { IFilterDto } from "../dto/filter.dto";
const log = debug("app-event-emitter:controller:log");


export class AnalitycsController{

    async getLogs(req:Request,res:Response){
       const {group,method,sub,type} = req.query as IFilterDto;
       const logs = await logAnalitycsService.getLogs(clean({group,method,sub,type}));
       res.json(logs);
    }
}

export default new AnalitycsController();