import { Kafka, Producer, RecordMetadata } from "kafkajs";
import { ProducerInterface, Topic } from "./brokers";
import {EventEmitter} from 'node:events';

import  debug from 'debug';
const log = debug('app:package:app-emitter:dispatcher');

export class KafkaProducer implements ProducerInterface{
    private emitter:EventEmitter;
    private producer: Producer;
    constructor(
        private kafka:Kafka
    ){
        this.emitter = new EventEmitter({
            captureRejections: true
        });
        this.configure();   
    }

    async configure(){
        this.producer = this.kafka.producer();
        await this.producer.connect()
    }


    getProducer(){
        return this.producer;
    }

    
    async produce<T>(topic: Topic, dto: T):Promise<RecordMetadata[]>{
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