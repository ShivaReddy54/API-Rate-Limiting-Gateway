# API Gateway with Rate Limiting (Node.js)

## Overview
This project implements an API Gateway using **Node.js and Express** that applies **per-user, per-endpoint rate limiting** using a **token bucket algorithm**. The gateway acts as a centralized control point for incoming traffic, ensuring fair usage of backend APIs while allowing controlled burst traffic.

The design focuses on **low-latency request interception**, **traffic throttling**, and **clean middleware-based architecture**.

---

## Key Features
- Token bucket–based rate limiting
- Per-user request throttling
- Per-API endpoint limits
- Burst traffic handling
- Centralized gateway architecture
- Standard HTTP `429 Too Many Requests` responses
- Lightweight and extensible design

---

## System Architecture

Client
|
v
API Gateway (Node.js + Express)
|
├── Rate Limiting Middleware (Token Bucket)
|
└── Backend API Endpoints



The API Gateway intercepts all incoming requests and enforces rate limiting rules before forwarding requests to backend services.

---

## Rate Limiting Design

### Request Identification
Each incoming request is uniquely identified using:
- **User ID** extracted from request headers (`x-user-id`)
- **API endpoint path**

rate_key = userId + ":" + apiPath


This enables independent throttling for each user and each API.

---

### Token Bucket Algorithm

Each user–API pair maintains a logical token bucket with:

- **Capacity**: Maximum number of tokens allowed
- **Refill Rate**: Number of tokens added per second
- **Current Tokens**: Available requests
- **Last Refill Time**: Timestamp of last token calculation

#### Request Handling Logic
1. Tokens are refilled based on time elapsed since the last request.
2. If at least one token is available, the request is allowed.
3. If no tokens are available, the request is rejected.

This approach allows short request bursts while maintaining long-term rate limits.

---

## Default Rate Limit Configuration
- **Maximum tokens**: 5
- **Refill rate**: ~5 requests per minute
- **Granularity**: Per user, per API endpoint

---

## Implementation Details

### Technology Stack
- **Node.js**
- **Express.js**

---

### In-Memory State Management
Rate limiting state is maintained in memory using a key-value store with the following structure:

```js
{
  tokens: number,
  lastRefill: timestamp
}


This allows constant-time operations and minimal overhead per request.

Request Flow:
1. Client sends a request with a user identifier in headers.
2. The API Gateway intercepts the request.
3. The token bucket is refilled based on elapsed time.
4. If a token is available, the request proceeds.
5. If no tokens remain, the request is rejected with an error response.


Available Endpoints
GET /api/orders
GET /api/payments


Each endpoint is independently rate-limited for each user.



Error Handling
Rate Limit Exceeded

HTTP Status Code: 429 Too Many Requests

Response Body:

{
  "message": "Rate Limit Exceeded"
}



Example Request
curl -H "x-user-id: user1" http://localhost:3000/api/orders


If the request rate exceeds the configured limits, the gateway responds with 429 Too Many Requests.




Limitations:
1. Rate limiting state is stored in memory and not shared across instances
2. Data is lost on application restart
3. Not suitable for horizontal scaling
4. No authentication or authorization enforcement
5. These constraints establish a clean foundation before introducing distributed state and secure identity verification.


Future Enhancements:
1. Distributed rate limiting using Redis
2. Atomic token bucket operations using Lua scripts
3. JWT-based authentication and role-based limits
4. Dynamic configuration without service restarts
5. Admin dashboard for policy management
6. Metrics and observability (latency, rejection rate)



Learning Outcomes:
1. API Gateway design principles
2. Token bucket rate limiting algorithm
3. Middleware-based traffic control
4. Handling burst traffic efficiently
5. Evaluating scalability and system trade-offs


