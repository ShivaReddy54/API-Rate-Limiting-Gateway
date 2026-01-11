const express = require('express')
const app = express()

app.use(express.json())

const buckets = new Map()
const CAPACITY = 5
const REFILL_RATE = 0.083 // ~5 per min

function tokenBucketLimiter(req, res, next){
    const userId = req.headers["x-user-id"] || "anonymous";
    const api = req.path;
    const key = `${userId}:${api}`;

    const now = Date.now() / 1000

    // If Bucket has no entry
    if(!buckets.has(key)){
        buckets.set(key, {
            tokens: CAPACITY - 1,
            lastRefill: now
        })
        return next()
    }

    const bucket = buckets.get(key)

    // Refill tokens based on time elapsed
    const delta = now - bucket.lastRefill
    bucket.tokens = Math.min(CAPACITY, bucket.tokens + delta * REFILL_RATE)
    bucket.lastRefill = now

    // If bucket contains the data
    if(bucket.tokens >= 1){
        bucket.tokens -= 1
        return next()
    }

    // Limit exceeded
    return res.status(429).json({ message: "Rate Limit Exceeded" })
}


app.use(tokenBucketLimiter)

app.get('/api/orders', (req, res) => {
    return res.status(200).json({ message: "Order Placed" })
})

app.get('/api/payments', (req, res) => {
    return res.status(200).json({ message: "Payment Proceeded" })
})


app.listen(3000, () => {
    console.log('Server is running at port 3000')
})