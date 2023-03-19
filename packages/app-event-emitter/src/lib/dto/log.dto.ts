

export interface ILogDto{
    identifier: string,
    method: string,
    host: string,
    path: string,
    headers: any,
}

export interface IActionLogDto extends ILogDto{
    sub?: string,
    group?: string,
    message?: string,
    context?: string,
    payload?: any,
}

export type IRequestLogDto = ILogDto