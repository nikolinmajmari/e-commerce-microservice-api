import { IActionLogDto, IRequestLogDto, ProductsLogGroup } from "@repo/app-event-emitter";
import { Request } from "express";

export function createRequestLog(req:Request):IRequestLogDto{
    const url = new URL(req.url, `http://${req.headers.host}`);
    return {
        headers: req.headers,
        host: url.host,
        identifier: null,
        method: req.method,
        path: url.pathname+url.search
    };
}

export function createActionLog(group: ProductsLogGroup,req,message):IActionLogDto{
    const url = new URL(req.url, `http://${req.headers.host}`);
    return {
        headers: req.headers,
        host: url.host,
        identifier: null,
        method: req.method,
        path: url.pathname+url.search,
        context: "products",
        group:group,
        message:message,
        payload:req.body,
        sub:req.user?.sub
    };
}