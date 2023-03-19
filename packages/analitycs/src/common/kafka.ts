import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId:"analitycs-client",
    brokers:[
        'localhost:29092',
    ]
});

export default kafka;