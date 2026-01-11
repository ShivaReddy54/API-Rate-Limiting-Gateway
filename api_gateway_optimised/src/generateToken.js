const jwt = require("jsonwebtoken");

const token = jwt.sign(
    { id: "user1", role: "free" }, "supersecret", { expiresIn: "1h" }
);

console.log(token);
