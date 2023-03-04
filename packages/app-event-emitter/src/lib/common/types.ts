export interface ObjectWithId{
    user_id?: string;
}

export enum EventType{
    API_REQUEST="API_REQUEST",
    API_ACTION="APP_ACTION",
}


export enum EventGroup{
    ANALITYCS_REQUESTS="ANALITYCS_REQUESTS"
}