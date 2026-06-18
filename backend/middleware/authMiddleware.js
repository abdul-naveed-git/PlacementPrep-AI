const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ error: "Authentication token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id email");

    if (!user) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    req.user = {
      id: user._id,
      email: user.email,
    };

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired authentication token" });
  }
};

module.exports = authMiddleware;
