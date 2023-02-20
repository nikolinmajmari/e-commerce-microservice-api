import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import BadRequest from "../../common/errors/http/bad_request_error";
import debug from "debug";
const log = debug("app:middleware:validation:create_user");
export default function (){
    return [
        body("firstName").isString().optional(),
        body("lastName").isString().optional(),
        body("gender").isIn(["male","female"]).optional(),
        body("email").isEmail().optional(),
        body("permissionLevel").isIn(["Admin","User"]).optional(),
        body("phone").isMobilePhone("any").optional(),
        body("username").isString().optional(),
        body("password").isString().optional(),
        body("birthDate").isDate().optional(),
        body("avatar").isString().optional(),
        body("status").isIn(["active","closed"]).optional(),
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