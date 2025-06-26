import EVENTS from "../../../constants/events";
import { Kafka } from "kafkajs";
import { UserModel } from "../models/UserModel";

const kafka = new Kafka({ clientId: "user-service", brokers: ["localhost:9092"] });
const producer = kafka.producer();

export const connectUserServiceProducer = async () => await producer.connect();

export const emitUserCreated = async (user: UserModel) => {
  await producer.send({
    topic: EVENTS.USER_CREATED,
    messages: [{ value: JSON.stringify(user) }],
  });
};
