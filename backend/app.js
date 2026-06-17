const connectDB = require("./config/db");
connectDB();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(morgan("tiny"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/roadmap", roadmapRoutes);

app.listen(3000, () => {
  console.log("Server Started");
});
