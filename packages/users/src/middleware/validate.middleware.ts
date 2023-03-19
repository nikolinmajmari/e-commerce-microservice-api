import { Request,Response,NextFunction } from "express";
import { validationResult } from "express-validator";
import BadRequest from "../common/errors/http/bad_request_error";
import { unlinkUploadedFile } from "../common/uploader";

export default (req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        /// if form had an error 
        unlinkUploadedFile(req);
        return next(new BadRequest(errors.array()));
    }else{
        return next();
    }
}