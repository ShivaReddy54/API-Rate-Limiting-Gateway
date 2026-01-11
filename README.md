# API Gateway with Distributed Rate Limiting

## 📌 Overview
This project implements a **high-performance API Gateway** using **Node.js and Express**, designed to protect backend services from excessive traffic and abuse while maintaining **low latency and high throughput**.  
The gateway acts as a centralized entry point for incoming requests and enforces **rate limiting per user and per API endpoint**.

The project is built incrementally to demonstrate how rate limiting evolves from a basic approach to a **production-ready, distributed system**.

---

## 🧠 Architecture Evolution

### 1️⃣ Initial Approach – In-Memory Rate Limiting
The first implementation uses an **in-memory data structure** to track request counts per user and endpoint.

**How it works:**
- Each request is identified using a combination of user ID and API path.
- Request counts are stored in memory with a fixed time window.
- Requests exceeding the limit receive an HTTP `429` response.

**Limitations:**
- Data is lost on server restart.
- Not scalable across multiple instances.
- Suitable only for learning or very small systems.

---

### 2️⃣ Improved Approach – Token Bucket Algorithm
The next iteration introduces the **Token Bucket algorithm**, allowing controlled request bursts while maintaining fairness.

**Key improvements:**
- Each user-endpoint pair maintains a token bucket.
- Tokens refill over time at a fixed rate.
- Short traffic bursts are allowed without overwhelming the system.

**Benefits:**
- More accurate and flexible rate limiting.
- Better user experience compared to fixed windows.
- Still limited to a single server instance.

---

### 3️⃣ Optimized Approach – Redis-Backed Distributed Rate Limiting
The final version implements **distributed rate limiting using Redis**, making the system production-ready.

**How it works:**
- Rate limit state is stored in Redis instead of memory.
- Token calculations are executed atomically to avoid race conditions.
- Multiple API Gateway instances share the same rate-limit state.

**Advantages:**
- Horizontally scalable.
- Consistent enforcement across servers.
- Reliable under high concurrency.
- Low-latency request handling.

---

## ⚙️ Tech Stack
- **Node.js**
- **Express.js**
- **Redis**
- **Lua scripting (Redis)**
- **Artillery (Load Testing)**

---

## 🚀 Features
- Per-user and per-endpoint rate limiting
- Token Bucket–based traffic control
- Redis-based distributed state management
- Graceful handling of burst traffic
- HTTP 429 responses for throttled requests
- Modular and extensible architecture

---

## 🧪 Load Testing
Load testing was performed using **Artillery** with:
- Warm-up phase
- Steady traffic phase
- High-load (rate-limit trigger) phase

**Results:**
- Stable response times under sustained load
- Accurate rate-limit enforcement
- No request failures
- Predictable performance under peak traffic

---


---

## ▶️ Running the Project

### Prerequisites
- Node.js (v18+)
- Redis
- Docker (optional)

### Start Redis
```bash
docker run -d --name redis-cache -p 6379:6379 redis


npm install
node index.js