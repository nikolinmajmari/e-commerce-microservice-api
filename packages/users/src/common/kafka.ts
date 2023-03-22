import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId:process.env.KAFKA_PRODUCER_CLIENT_ID,
    brokers:[
        process.env.KAFKA_BROKER_1,
    ]
});

export default kafka;