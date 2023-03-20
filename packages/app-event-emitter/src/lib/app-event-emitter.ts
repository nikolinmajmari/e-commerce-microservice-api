import {EventEmitter} from 'node:events';
import { Kafka} from "kafkajs";
import { KafkaConsumer } from "./common/broker/kafka.consumer";
import { KafkaProducer } from "./common/broker/kafka.producer";
import { AppMessageConsumer, Topic } from "./common/broker/brokers";
import { IActionLogDto, IRequestLogDto } from "./dto/log.dto";
import debug from "debug";
const log=debug("app:package:app-event-emitter:core");

/**
 * 
 */
export class AppEventEmitter {
  
  private consumer: KafkaConsumer;
  private producer: KafkaProducer;
  private emitter:EventEmitter;

  constructor(private kafka:Kafka){
    this.emitter = new EventEmitter();
    this.consumer = new KafkaConsumer(kafka);
    this.producer = new KafkaProducer(kafka);
  }

  produceAppRequestEvent(dto:IRequestLogDto){
    this.producer.produce(Topic.API_REQUEST,dto);
  }

  produceAppActionEvent(dto:IActionLogDto){
    this.producer.produce(Topic.APP_ACTION,dto);
  }

  consumeAppRequestEvent( handler:AppMessageConsumer<IRequestLogDto>){
    this.consumer.consume<IRequestLogDto>(
      Topic.API_REQUEST,handler);
  }

  consumeAppActionEvent(handler:AppMessageConsumer<IActionLogDto>){
    this.consumer.consume<IActionLogDto>(Topic.APP_ACTION,handler);
  }
}
