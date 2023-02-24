import { Request,Response,NextFunction } from "express";
import debug from "debug";
import emmitter from "../../common/emmiter";

const log = debug("app:middleware:analitycs");
export default async function (req:Request,res:Response,next:NextFunction){
    try{
        log("request, emmiting request event");
        await emmitter.emitRequestEvent(req);
    }catch(e){
        log(e);
    }finally{
        next();
    }
}