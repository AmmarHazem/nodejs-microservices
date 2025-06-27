import { EachMessagePayload, Kafka } from "kafkajs";
import EVENTS from "../../../constants/events";

const kafka = new Kafka({ brokers: ["kafka:9092"], clientId: "email-service" });
const consumer = kafka.consumer({ groupId: "email-group" });

export async function connectConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: [EVENTS.ORDER_CREATED, EVENTS.USER_CREATED] });
  await consumer.run({
    eachMessage: async function (payload: EachMessagePayload) {
      try {
        const event = JSON.parse(payload.message.value?.toString() ?? "");
        if (payload.topic === EVENTS.ORDER_CREATED) {
          console.log(`Sending Order Confirmation to User ${event.userId}`);
        } else if (payload.topic === EVENTS.USER_CREATED) {
          console.log(`Sending Welcome Email to ${event.id}`);
        }
      } catch (e) {
        console.log("--- email consumer eachMessage error", e);
      }
    },
  });
}
