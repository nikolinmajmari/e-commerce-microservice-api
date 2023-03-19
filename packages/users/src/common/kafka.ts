import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId:"my-producer-unique-client-id",
    brokers:[
        'localhost:29092',
    ]
});

export default kafka;