import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import BadRequest from "../../common/errors/http/bad_request_error";
import debug from "debug";
const log = debug("app:middleware:validation:create_user");
export default function (){
    return [
        body("address").isString(),
        body("city").isString(),
        body("postalCode").isNumeric(),
        body("state").isString(),
        body("primary").isBoolean().optional(),
        body("label").isString(),
        (req:Request,res:Response,next:NextFunction)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(new BadRequest(errors.array()));
            }else{
                return next();
            }
        }
    ]
}