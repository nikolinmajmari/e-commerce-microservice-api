import { Consumer, Kafka } from "kafkajs";
import { AppMessageConsumer, ConsumerInterface, Topic } from "./brokers";

import  debug from 'debug';
const log = debug('app:package:app-emitter:subscriber');

export class KafkaConsumer implements ConsumerInterface{
    
    private consumer: Consumer;
    constructor(
        private kafka:Kafka
    ){
        this.configure();   
    }

    async configure(){
        this.consumer = this.kafka.consumer({
            groupId: "logger"
        });
        await this.consumer.connect()
    }

    getConsumer(){
        return this.consumer;
    }
    
    async consume<T>(topic: Topic, handler: AppMessageConsumer<T>) {
        log("started subscriber on topic",topic);
        await this.consumer.subscribe({topic});
        this.consumer.run({
            eachMessage: async ({partition,message})=>{
                handler(
                    JSON.stringify(
                        message.value.toString()
                    ) as unknown as T,
                    topic
                )
            }
        })
    }
    
}