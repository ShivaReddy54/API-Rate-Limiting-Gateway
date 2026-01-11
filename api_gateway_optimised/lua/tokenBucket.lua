local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local ttl = tonumber(ARGV[4])

local data = redis.call("HMGET", key, "tokens", "lastRefill")

local tokens = tonumber(data[1])
local lastRefill = tonumber(data[2])

if tokens == nil then
  redis.call("HMSET", key,
    "tokens", capacity - 1,
    "lastRefill", now
  )
  redis.call("EXPIRE", key, ttl)
  return 1
end

local delta = now - lastRefill
tokens = math.min(capacity, tokens + delta * refill_rate)

if tokens < 1 then
  return 0
end

tokens = tokens - 1

redis.call("HMSET", key,
  "tokens", tokens,
  "lastRefill", now
)

return 1
