import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import BadRequest from "../../common/errors/http/bad_request_error";
import debug from "debug";
const log = debug("app:middleware:validation:create_user");
export default function (){
    return [
        body("address").isString().optional(),
        body("city").isString().optional(),
        body("postalCode").isNumeric().optional(),
        body("state").isString().optional(),
        body("primary").isBoolean().optional(),
        body("label").isString().optional(),
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