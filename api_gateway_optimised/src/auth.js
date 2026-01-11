const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({ message: "Missing token" });
    }

    const token = authHeader.split(" ")[1];

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
        req.user = payload; // { id, role }
        next();
    }catch (err){
        return res.status(401).json({ message: "Invalid token" });
    }
};
