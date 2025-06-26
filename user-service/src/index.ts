import express from "express";
import { connectUserServiceProducer } from "./kafka/producer";
import userRoutes from "./routes/user.routes";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use("/api/users", userRoutes);

async function startServer() {
  try {
    // Connect to Kafka
    await connectUserServiceProducer();
    console.log("✅ User Service Kafka producer connected");
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 User Service running on http://localhost:${PORT}`);
      console.log(`📝 API Endpoints:`);
      console.log(`   POST /api/users - Create a new user`);
    });
  } catch (error) {
    console.error("❌ Failed to start User Service:", error);
    process.exit(1);
  }
}

startServer();
