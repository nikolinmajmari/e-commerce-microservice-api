import { Kafka, Producer } from "kafkajs";
import { ProducerInterface, Topic } from "./brokers";

import  debug from 'debug';
const log = debug('app:package:app-emitter:dispatcher');

export class KafkaProducer implements ProducerInterface{
    
    private producer: Producer;
    constructor(
        private kafka:Kafka
    ){
        this.configure();   
    }

    async configure(){
        this.producer = this.kafka.producer();
        await this.producer.connect()
    }


    getProducer(){
        return this.producer;
    }

    
    produce<T>(topic: Topic, dto: T) {
        try{
            return this.producer.send({
                topic: topic,
                messages:[
                    {
                        value: Buffer.from(
                            JSON.stringify(dto)
                        )
                    }
                ]
            })
        }catch(e){
            log(e);
        }
    }
}