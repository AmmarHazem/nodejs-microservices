import { Kafka, Partitioners } from "kafkajs";
import EVENTS from "../../../constants/events";
import { OrderModel } from "../../models/OrderModel";

const kafka = new Kafka({ clientId: "orders-service", brokers: ["kafka:9092"] });

const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });

export async function connectOrderServiceProducer() {
  return producer.connect();
}

export async function emitOrderCreated(order: OrderModel) {
  producer.send({ topic: EVENTS.ORDER_CREATED, messages: [{ value: JSON.stringify(order) }] });
}
