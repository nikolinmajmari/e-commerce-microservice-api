import { NextFunction, Request, Response } from "express";
import usersService from "../../services/users.service";

export default async function(req:Request,res:Response,next:NextFunction){
    const user = await usersService.getUserById(
        req.params.id
    );
    if(user==null){
        return res.status(404).send("not found");/// throw custom error
    }
    next();
}