import { NextFunction, Request, Response } from "express";
import usersService from "../../services/user.service";

export default async function(req:Request,res:Response,next:NextFunction){
    const user = await usersService.getUser(
        req.params.id
    );
    if(user==null){
        return res.status(404).send("not found");/// throw custom error
    }
    next();
}