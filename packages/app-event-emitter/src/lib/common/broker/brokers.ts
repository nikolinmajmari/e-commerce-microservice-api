import { RecordMetadata } from "kafkajs";

export enum Topic{
    API_REQUEST="api.request",
    APP_ACTION="api.action",
}



export interface ConsumerInterface{
    consume<T>(topic:Topic,handler:AppMessageConsumer<T>);
}

export interface ProducerInterface{
    produce<T>(topic:Topic,dto: T):Promise<RecordMetadata[]>;
}

export type AppMessageConsumer<T> = (dto:T,topic:Topic)=>Promise<any>;