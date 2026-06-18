require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const aiRoutes = require("./routes/aiRoutes");
const experienceRoutes = require("./routes/experienceRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

/* -------------------- ENV VALIDATION -------------------- */
const requiredEnv = ["MONGO_URI", "JWT_SECRET", "CLIENT_ORIGIN"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
});

/* -------------------- TRUST PROXY (for Render/Railway/etc) -------------------- */
app.set("trust proxy", 1);

/* -------------------- SECURITY MIDDLEWARE -------------------- */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN.split(","),
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

/* -------------------- LOGGING -------------------- */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* -------------------- RATE LIMITERS -------------------- */

// Global API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

// Strict auth limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts. Please try again later.",
  },
});

// Strict AI limiter (important for cost control)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "AI rate limit exceeded. Try again later." },
});

/* -------------------- DB CONNECTION -------------------- */
async function startServer() {
  try {
    await connectDB();
    console.log("✅ Database connected");

    /* -------------------- ROUTES -------------------- */
    app.use("/api", apiLimiter);

    app.use("/api/auth", authLimiter, authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/roadmap", roadmapRoutes);
    app.use("/api/ai", aiLimiter, aiRoutes);
    app.use("/api/experience", experienceRoutes);

    /* -------------------- 404 HANDLER -------------------- */
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Cannot ${req.method} ${req.originalUrl}`,
      });
    });

    /* -------------------- GLOBAL ERROR HANDLER -------------------- */
    app.use((err, req, res, next) => {
      if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON payload." });
      }

      console.error("🔥 Server Error:", err);

      res.status(500).json({
        error: "Something went wrong on the server.",
      });
    });

    /* -------------------- START SERVER -------------------- */
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
