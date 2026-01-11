# API Gateway with Rate Limiting (Node.js)

## Overview
This project implements a lightweight API Gateway using **Node.js and Express** that enforces **per-user, per-endpoint rate limiting**. The gateway acts as a centralized entry point for client requests, ensuring controlled access to backend APIs and protecting services from excessive traffic.

The project demonstrates core backend system design concepts such as **request interception**, **traffic throttling**, and **middleware-driven architecture**.

---

## Key Features
- Per-user rate limiting
- Per-API endpoint request throttling
- Centralized request interception via middleware
- Configurable rate limit parameters
- Standard HTTP `429 Too Many Requests` responses
- Simple and extensible architecture

---

## System Architecture

Client
|
v
API Gateway (Node.js + Express)
|
├── Rate Limiting Middleware
|
└── Backend API Endpoints




The API Gateway intercepts all incoming requests and applies rate limiting policies before allowing requests to reach backend services.

---

## Rate Limiting Design

### Request Identification
Each request is uniquely identified using:
- **User ID** from request headers (`x-user-id`)
- **API endpoint path**

rate_key = userId + ":" + apiPath




This allows independent rate limiting per user and per endpoint.

---

### Rate Limiting Policy
- Each user is allowed a fixed number of requests per API endpoint within a defined time window.
- Requests exceeding the limit are rejected.

**Default Policy Configuration**
- Maximum requests: **5**
- Time window: **60 seconds**

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
  count: number,
  windowStart: timestamp
}



Request Flow:
1. Client sends a request with a user identifier in request headers.
2. The API Gateway receives the request.
3. Rate limiting middleware evaluates request usage for the user and endpoint.
4. If within limits, the request is processed normally.
5. If the limit is exceeded, the gateway responds with an HTTP 429 error.


Available Endpoints
GET /api/orders
GET /api/payments


Each endpoint is rate-limited independently for each user.


Error Handling
Rate Limit Exceeded

HTTP Status Code: 429 Too Many Requests

Response Body:

{
  "message": "Rate limit exceeded"
}

Example Request
curl -H "x-user-id: user1" http://localhost:3000/api/orders


Sending more than the allowed number of requests within the configured time window will result in a 429 response.




Limitations:
1. Rate limiting state is stored in memory and not shared across instances
2. Data is lost when the server restarts
3. Not suitable for horizontal scaling
4. Fixed time window may allow short traffic bursts
5. These limitations help establish a baseline implementation and motivate more advanced, distributed solutions.


Future Enhancements:
1. Distributed rate limiting using Redis
2. Token bucket or leaky bucket algorithms
3. JWT-based authentication and authorization
4. Dynamic rate limit configuration
5. Admin dashboard for policy management
6. Horizontal scaling support
7. Detailed metrics and monitoring


