This project implements an API Gateway–level rate limiter using Node.js, Express, and Redis.
It controls the number of requests a user can make to specific APIs within a defined time window, ensuring system stability, fair usage, and protection against abuse.

The rate limiting logic is implemented using a Token Bucket algorithm executed atomically inside Redis using Lua scripting, making it safe and scalable in distributed environments.




Key Features:
1. Centralized API Gateway rate limiting
2. Token Bucket algorithm for smooth traffic control
3. Redis-backed state for horizontal scalability
4. Atomic operations using Redis Lua scripts
5. Per-user and per-API rate limiting
6. Easy configuration via environment variables
7. Production-ready middleware design



Tech Stack:
1. Node.js
2. Express.js
3. Redis
4. Redis Lua Scripting
5. JWT Authentication (optional integration)


Architecture
Client
  |
  v
API Gateway (Express Middleware)
  |
  v
Redis (Token Bucket State via Lua Script)



Flow:
1. Client sends a request with a user identifier.
2. API Gateway intercepts the request.
3. Redis Lua script:
    • Refills tokens based on elapsed time
    • Checks token availability
    • Consumes a token if allowed
4. Request is either forwarded to the API or rejected with 429.



Rate Limiting Strategy:

Token Bucket Algorithm:
1. Each user–API pair has a bucket.
2. Bucket has a maximum capacity.
3. Tokens refill at a fixed rate.
4. Each request consumes one token.
5. Requests are rejected when tokens are exhausted.



Configuration:
Parameter	Value	Description
Capacity	5	Maximum tokens per bucket
Refill Rate	~5/min	Token refill speed
TTL	60s	Redis key expiration





Redis Data Model
Each bucket is stored as a Redis hash:
rate:<userId>:<apiPath>


Fields:
tokens → remaining tokens
lastRefill → last refill timestamp (epoch seconds)




Atomicity & Consistency
To prevent race conditions:
    • All operations are executed inside a Redis Lua script
    • Lua scripts run atomically in Redis
    • Ensures correctness even with concurrent requests and multiple server instances



Middleware Responsibility
The rate limiter middleware:
    • Extracts user identifier from request headers
    • Generates a unique Redis key per user + API
    • Executes Redis Lua script
    • Allows or blocks the request based on result



Scalability
This design supports:
    • Multiple Node.js instances
    • Load balancers
    • High traffic scenarios
    • Stateless application servers
    • Redis acts as the single source of truth.



Security Considerations:
    • Per-user rate limits prevent abuse    
    • Can be combined with JWT authentication   
    • Supports tier-based limits (free vs premium)



Extensibility:
    • Possible enhancements:
    • Sliding window rate limiting    
    • Tier-based dynamic limits 
    • Prometheus metrics (RPS, p95, p99)    
    • Fail-open or fail-closed Redis strategy   
    • Admin APIs for dynamic configuration



Interview Summary:
This project demonstrates how to build a production-grade API Gateway rate limiter using Redis and Lua to ensure atomic operations, horizontal scalability, and accurate request throttling across distributed systems.