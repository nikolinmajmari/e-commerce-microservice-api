import { Request,Response } from "express";
import logAnalitycsService from "../service/log_analitycs.service";
import debug from "debug";
import { clean } from "../common/utils";
import { IFilterDto } from "../dto/filter.dto";
const log = debug("app:controller:analitycs");


export class AnalitycsController{

    async getLogs(req:Request,res:Response,next){
       try{
        log("app:controller:analitycs:getlogs")
        const {group,method,sub,type} = req.query as IFilterDto;
        const logs = await logAnalitycsService.getLogs(clean({group,method,sub,type}));
        res.json(logs);
       }catch(e){
        log(e);
        next(e);
       }
    }
}

export default new AnalitycsController();