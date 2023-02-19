import { Response,Request, NextFunction } from "express";
import debug from "debug";
import { AppError } from "../app_error";
import HttpError from "../http/http.errors";
import InternalServerError from "../http/ineral_server_error";

const log = debug("app:main:errorHandler:middleware");
export default function(err,req:Request,res:Response,next:NextFunction){
    if(err instanceof AppError){
        const error = err instanceof HttpError? err: new InternalServerError(err) ;
        const data = error.toJson();
        if(process.env.APP_ENV!=="dev"&& process.env.APP_ENV!=="test"){
            delete data.type;
            delete data.stack;
            delete data.error;
        }
        if(error.status==500){
            log("An internal server error occured",err);
        }
        res.status(error.status).send(
            {
                ...err.toJson(),
            }
        )
    }else if(err.status==400){
        res.status(400).json(err);
    }
    else{
        log("An unhandled error occured",JSON.stringify(err));
        res.status(500).json({
            status:500,
            message: "An error occured",
            error: process.env.APP_ENV!=="dev"&& process.env.APP_ENV!=="test"
            ?
            {}
            :
            err
        });
    }
}