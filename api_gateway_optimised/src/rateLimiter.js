const redis = require("./redis.js");

const CAPACITY = 5;                 // max tokens
const REFILL_RATE = 0.083;          // tokens per second (~5 per minute)
const TTL = 60;                     // seconds

// Redis Lua script (ATOMIC token bucket)
const luaScript = `
local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local ttl = tonumber(ARGV[4])

local data = redis.call("HMGET", key, "tokens", "lastRefill")

local tokens = tonumber(data[1])
local lastRefill = tonumber(data[2])

-- First request (initialize bucket)
if tokens == nil then
  redis.call("HMSET", key,
    "tokens", capacity - 1,
    "lastRefill", now
  )
  redis.call("EXPIRE", key, ttl)
  return 1
end

-- Refill tokens
local delta = now - lastRefill
tokens = math.min(capacity, tokens + delta * refill_rate)

-- Not enough tokens
if tokens < 1 then
  return 0
end

-- Consume token
tokens = tokens - 1

redis.call("HMSET", key,
  "tokens", tokens,
  "lastRefill", now
)

return 1
`;

module.exports = async function rateLimiter(req, res, next) {
  const userId = req.headers["x-user-id"] || "anonymous";
  const api = req.path;
  const key = `rate:${userId}:${api}`;

  const now = Math.floor(Date.now() / 1000); // MUST be integer

  try {
    const allowed = await redis.eval(luaScript, {
      keys: [key],
      arguments: [
        CAPACITY.toString(),
        REFILL_RATE.toString(),
        now.toString(),
        TTL.toString()
      ]
    });

    if (allowed === 1) {
      return next();
    }

    return res.status(429).json({ message: "Rate limit exceeded" });
  } catch (err) {
    console.error("Rate limiter error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
