# Node.js Microservices with Kafka

This is a simple microservices application demonstrating event-driven architecture using Kafka. The application consists of three services:

- **User Service** (Port 3001): Creates users and emits `user-created` events
- **Order Service** (Port 3003): Creates orders and emits `order-created` events  
- **Email Service** (Port 3002): Consumes events and simulates sending emails

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ User Service│    │Order Service│    │Email Service│
│   (3001)    │    │   (3003)    │    │   (3002)    │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                    ┌─────▼─────┐
                    │   Kafka   │
                    │  (9092)   │
                    └───────────┘
```

## Prerequisites

- Docker and Docker Compose
- Node.js (v16 or higher) - only needed for local development
- npm or yarn

## Quick Start

### Option 1: Run Everything with Docker Compose (Recommended)

This is the easiest way to run the entire application:

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

This will start:
- Zookeeper (Port 2181)
- Kafka (Port 9092)
- User Service (Port 3001)
- Email Service (Port 3002)
- Order Service (Port 3003)

### Option 2: Run Services Locally

If you prefer to run the Node.js services locally while using Docker for Kafka:

#### 1. Start Kafka Infrastructure

```bash
# Start Kafka and Zookeeper using Docker Compose
docker-compose up -d zookeeper kafka
```

#### 2. Install Dependencies

```bash
# Install dependencies for all services
cd user-service && npm install
cd ../email-service && npm install  
cd ../order-services && npm install
```

#### 3. Start the Services

Open three terminal windows and run each service:

**Terminal 1 - User Service:**
```bash
cd user-service
npm start
```

**Terminal 2 - Email Service:**
```bash
cd email-service
npm start
```

**Terminal 3 - Order Service:**
```bash
cd order-services
npm start
```

## Testing the Application

### 1. Test User Creation

Create a new user:
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

**Expected Response:**
```json
{
  "id": 1234567890,
  "name": "John Doe", 
  "email": "john@example.com",
  "orderCount": 0
}
```

**Email Service Log:**
```
📧 Sending Welcome Email to john@example.com
```

### 2. Test Order Creation

Create a new order (use the user ID from step 1):
```bash
curl -X POST http://localhost:3003/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1234567890,
    "productName": "Laptop",
    "quantity": 1
  }'
```

**Expected Response:**
```json
{
  "id": 1234567891,
  "userId": 1234567890,
  "productName": "Laptop",
  "quantity": 1,
  "status": "pending",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**Email Service Log:**
```
📧 Sending Order Confirmation to User 1234567890
```

### 3. Health Checks

Check if all services are running:

```bash
# User Service
curl http://localhost:3001/api/users

# Email Service  
curl http://localhost:3002/health

# Order Service
curl http://localhost:3003/health
```

## Understanding the Flow

1. **User Creation**: When you create a user via the User Service, it emits a `user-created` event to Kafka
2. **Email Service**: Listens for `user-created` events and simulates sending a welcome email
3. **Order Creation**: When you create an order via the Order Service, it emits an `order-created` event to Kafka
4. **Email Service**: Listens for `order-created` events and simulates sending an order confirmation email

## Docker Compose Configuration

The `docker-compose.yml` file defines all services:

```yaml
services:
  zookeeper:          # Required by Kafka
```bash
# In each service directory
npm run dev
```

## Cleanup

Stop all services and Kafka:

```bash
# Stop the services (Ctrl+C in each terminal)
# Stop Kafka and Zookeeper
docker-compose down
```

## Troubleshooting

1. **Kafka Connection Issues**: Make sure Docker is running and `docker-compose up -d` completed successfully
2. **Port Already in Use**: Check if ports 3001, 3002, 3003 are available
3. **TypeScript Errors**: Run `npm install` in each service directory to install dependencies

## Next Steps

- Add database persistence for users and orders
- Implement proper error handling and retry mechanisms
- Add authentication and authorization
- Implement proper logging and monitoring
- Add unit and integration tests 
