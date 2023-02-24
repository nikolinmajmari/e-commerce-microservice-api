import { Request,Response } from "express";
import logService from "../services/log.service";



export class LogController{

    async getLogs(req:Request,res:Response){
       const logs = await logService.getLogs();
       res.json(logs);
    }
}

export default new LogController();