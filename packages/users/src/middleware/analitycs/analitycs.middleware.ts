import { Response,NextFunction } from "express";
import debug from "debug";
import {emitter} from "../../common/emmiter";

const log = debug("app:middleware:analitycs");
export default async function (req,res:Response,next:NextFunction){
    try{
        log("request, emmiting request event");
        await emitter.emitApiRequestEvent(req);
    }catch(e){
        log(e);
    }finally{
        next();
    }
}