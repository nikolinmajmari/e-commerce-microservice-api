export interface ILogDto{
    /// request identifier
    identifier:string,
    /// log type can be api request or app action 
    type: string,

    /// log group 
    group?: string,

    /// user taking action 
    sub?: string,

    /// message 
    message?: string,

    /// payload 
    payload?: string,

    /// headers 
    headers?:string,

    /// method 
    method?:string,
    
    /// uri
    host?:string

    /// path 
    path?:string
}