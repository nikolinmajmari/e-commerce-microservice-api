import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import BadRequest from "../../common/errors/http/bad_request_error";
import debug from "debug";
const log = debug("app:middleware:validation:create_user");
export default function (){
    return [
        body("firstName").isString(),
        body("lastName").isString(),
        body("gender").isIn(["male","female"]),
        body("email").isEmail(),
        body("phone").isMobilePhone("any"),
        body("username").isString(),
        body("password").isString(),
        body("birthDate").isDate(),
        body("avatar").isString(),
        body("addresses").isArray(),
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