import express from "express";
import { connectConsumer } from "./kafka/consumer";
import { Response, Request } from "express";

const app = express();
const PORT = 3002;

app.use(express.json());

// Simple health check endpoint
app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "Email Service is running", timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    // Connect to Kafka consumer
    await connectConsumer();
    console.log("✅ Email Service Kafka consumer connected");
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Email Service running on http://localhost:${PORT}`);
      console.log(`📝 API Endpoints:`);
      console.log(`   GET /health - Health check`);
      console.log(`📧 Listening for events: user-created, order-created`);
    });
  } catch (error) {
    console.error("❌ Failed to start Email Service:", error);
    process.exit(1);
  }
}

startServer();
