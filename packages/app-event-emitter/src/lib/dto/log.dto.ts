import { Request } from "express";

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
    url: string,
    headers: any,
}

export interface IApiAction{
    identifier: string,
    sub: string,
    context?: string,
    group?: string,
    message?: string,
    payload?: any,// serialized
    headers?:any, // serialized 
    method?:string,
    uri?:string,
}