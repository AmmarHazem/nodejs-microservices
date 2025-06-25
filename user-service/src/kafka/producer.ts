import EVENTS from "../../../constants/events";
import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "user-service", brokers: ["localhost:9092"] });
const producer = kafka.producer();

const connectProducer = async () => await producer.connect();

const emitUserCreated = async (user) => {
  await producer.send({
    topic: EVENTS.USER_CREATED,
    messages: [{ value: JSON.stringify(user) }],
  });
};
