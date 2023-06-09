import { Response,NextFunction } from "express";
import debug from "debug";
import emitter from "../../common/event_emitter.service";

const log = debug("app:middleware:analitycs");
export default async function (req,res:Response,next:NextFunction){
    try{
        log("request, emmiting request event");
        await emitter.logRequest(req);
    }catch(e){
        log(e);
    }finally{
        next();
    }
}
