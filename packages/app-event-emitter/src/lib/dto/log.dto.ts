export interface ILogDto{
    identifier: string,
    type?: string,
    sub?: string,
    group?: string,
    message?: string,
    context?: string,
    payload?: string,
    headers?:string,
    method?:string,
    uri?:string,
}