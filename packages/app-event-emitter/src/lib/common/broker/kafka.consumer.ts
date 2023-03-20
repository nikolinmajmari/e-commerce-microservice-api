import { Consumer, Kafka } from "kafkajs";
import { AppMessageConsumer, ConsumerInterface, Topic } from "./brokers";
import {EventEmitter} from 'node:events';
import  debug from 'debug';
const log = debug('app:package:app-emitter:subscriber');

export class KafkaConsumer implements ConsumerInterface{

    private emitter:EventEmitter;
    private consumer: Consumer;
    constructor(
        private kafka:Kafka
    ){
        this.emitter = new EventEmitter();
        this.configure();   
    }

    async configure(){
        this.consumer = this.kafka.consumer({
            groupId: "logger"
        });
        await this.consumer.connect();
    }

    getConsumer(){
        return this.consumer;
    }
    
    async consume<T>(topic: Topic, handler: AppMessageConsumer<T>):Promise<void> {
        await this.consumer.subscribe({topic});
        this.emitter.on(topic,handler);
        this.consumer.run({
            eachMessage: async ({topic,partition,message})=>{
                const dto = JSON.parse(message.value.toString()) as unknown as T;
                setImmediate(()=>this.emitter.emit(topic,dto,topic as Topic));
            }
        })
    }
    
}