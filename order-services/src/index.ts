import express from "express";
import { connectOrderServiceProducer, emitOrderCreated } from "./kafka/producer";
import { OrderModel } from "../models/OrderModel";
import { Request, Response } from "express";

const app = express();
const PORT = 3003;

app.use(express.json());

// Create order endpoint
app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const { userId, productName, quantity } = req.body;
    const newOrder: OrderModel = {
      id: Date.now(),
      userId,
      productName,
      quantity,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    // Emit order created event
    await emitOrderCreated(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Health check endpoint
app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "Order Service is running", timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    // Connect to Kafka
    await connectOrderServiceProducer();
    console.log("✅ Order Service Kafka producer connected");
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Order Service running on http://localhost:${PORT}`);
      console.log(`📝 API Endpoints:`);
      console.log(`   POST /api/orders - Create a new order`);
      console.log(`   GET /health - Health check`);
    });
  } catch (error) {
    console.error("❌ Failed to start Order Service:", error);
    process.exit(1);
  }
}

startServer();
