import { NextFunction, Request, Response } from "express";
import NotFound from "../../common/errors/http/not_found.error.";
import usersService from "../../services/users.service";

export default async function(req:Request,res:Response,next:NextFunction){
    const user = await usersService.getUser(
        req.params.id
    );
    if(user==null){
        return next(new NotFound("User not found"));
    }
    if(user?.addresses.find(addr=>addr._id==req.params.address)==undefined){
        return next(new NotFound("address not found"));
    }
    next();
}