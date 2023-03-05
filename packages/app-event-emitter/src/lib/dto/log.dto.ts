import { Request } from "express";
import { EventType, ObjectWithId } from "../common/types";

export interface ILogDto{
    identifier: string,
    type?: string,
    sub?: string,
    group?: string,
    message?: string,
    context?: string,
    payload?: any,
    headers?:any,
    method?:string,
    uri?:string,
}

export interface IApiRequest{
    identifier: string,
    method: string,
    type:EventType,
    uri: string,
    headers: any,
    message: string
}

export interface IApiAction{
    identifier: string,
    sub?: ObjectWithId,
    context?: string,
    group?: string,
    message?: string,
    payload?: any,// serialized
    headers?:any, // serialized 
    method?:string,
    uri?:string,
}