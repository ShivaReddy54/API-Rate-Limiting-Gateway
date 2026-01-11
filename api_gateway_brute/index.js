const express = require('express')
const app = express();

app.use(express.json())


const rateLimitStore = new Map()
const LIMIT = 5
const WINDOW_MS = 60000

// Rate Limiter Middleware
function rateLimiter(req, res, next){
    const userId = req.headers["x-user-id"] || "anonymous";
    const api = req.path;
    const key = `${userId}:${api}`;

    const now = Date.now()

    // If Data is not found
    if(!rateLimitStore.has(key)){
        rateLimitStore.set(key, {
            count: 1,
            windowStart: now
        });
        return next()
    }

    const enrty = rateLimitStore.get(key)

    // If Data found after expiration
    if(now - enrty.windowStart > WINDOW_MS){
        enrty.count = 1
        enrty.windowStart = now
        return next()
    }

    // If Data found within Time and count not exceeds
    if(enrty.count < LIMIT){
        enrty.count++;
        return next()
    }

    return res.status(429).json({ message: "Rate limit exceeded"})
}

// Apply rate limiter Middleware
app.use(rateLimiter)


// API's
app.get('/api/orders', (req, res) => {
    return res.status(200).json({ message: "Order Placed" })
})

app.get('/api/payments', (req, res) => {
    return res.status(200).json({ message: "Payment Proceeded" })
})


// Start Server
app.listen(3000, () =>{
    console.log("Server started at port 3000")
})