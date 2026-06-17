const connectDB = require("./config/db");
const OTP = require("./models/OTP.js");
const User = require("./models/User.js");
const DSARoadmap = require("./models/DSARoadmap");
connectDB();
const express = require("express");
const app = express();
app.use(express.json());

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({
        error: "Please enter a valid email address.",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    let record = await OTP.findOne({ email });
    if (record) {
      record.otp = otp;
      record.expiresAt = expiresAt;
      await record.save();
    } else {
      await OTP.create({
        email,
        otp,
        expiresAt,
      });
    }
    res.json({
      message: "A verification code has been dispatched.",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/api/auth/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and verification code are required.",
      });
    }

    const record = await OTP.findOne({ email });

    if (!record || record.otp !== otp || record.expiresAt < new Date()) {
      return res.status(400).json({
        error: "Invalid or expired verification code.",
      });
    }

    await OTP.deleteOne({ email });

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        isVerified: true,

        leetcodeUsername: "",

        targetCompanies: [],

        targetRole: "",

        weakTopics: [],
      });

      const roadmap = await DSARoadmap.create({
        userId: user._id,

        title: "Core SDE DSA Preparation Roadmap",

        targetRole: user.targetRole,

        targetCompanies: [],

        topics: [],
      });

      user.selectedRoadmapId = roadmap._id;

      await user.save();
    }

    res.json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server Started");
});
