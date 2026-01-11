require("dotenv").config();
const express = require("express");

const auth = require("./auth.js");
const rateLimiter = require("./rateLimiter.js");

const app = express();
app.use(express.json());

app.use(auth);
app.use(rateLimiter);

app.get("/api/orders", (req, res) => {
    res.json({ message: "Order placed" });
});

app.get("/api/payments", (req, res) => {
    res.json({ message: "Payment processed" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`API Gateway running on port ${process.env.PORT}`);
});
