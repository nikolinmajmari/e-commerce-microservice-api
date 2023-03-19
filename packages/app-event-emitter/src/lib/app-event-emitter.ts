import { EventEmitter } from "stream";
import mongooseService from "./common/mongoose.service";
import debug from "debug";
import { KafkaConsumer } from "./common/broker/kafka.consumer";
import { KafkaProducer } from "./common/broker/kafka.producer";
import { Kafka} from "kafkajs";
import { AppMessageConsumer, Topic } from "./common/broker/brokers";
import { IActionLogDto, IRequestLogDto } from "./dto/log.dto";
const log=debug("app:package:app-event-emitter:core");

/**
 * 
 */
export class AppEventEmitter {
  
  private consumer: KafkaConsumer;
  private producer: KafkaProducer;

  constructor(private kafka:Kafka){
    this.consumer = new KafkaConsumer(kafka);
    this.producer = new KafkaProducer(kafka);
    log("event emmitter created ");
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
