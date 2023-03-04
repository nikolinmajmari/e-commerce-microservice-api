import {NextFunction } from "express";
import { randomBytes } from "crypto";
export default  function (req,res,next:NextFunction){
    randomBytes(20,function(err,buff){
        if(!err){
            req["identifier"] = buff.toString("hex");
        }
       next();
    });
}
