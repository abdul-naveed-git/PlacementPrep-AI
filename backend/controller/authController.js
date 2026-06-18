const OTP = require("../models/OTP.js");
const User = require("../models/User.js");
const DSARoadmap = require("../models/DSARoadmap");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { sendOTPEmail, sendWelcomeEmail } = require("../utils/mail");
const { setAuthCookie, clearAuthCookie } = require("../utils/authCookies");

const sanitizeUser = (user) => {
  if (!user) return null;
  const plainUser = user.toObject ? user.toObject() : { ...user };
  delete plainUser.password;
  return plainUser;
};

const issueSession = (res, user) => {
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });
  setAuthCookie(res, token);
  return token;
};

exports.Register = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({
        error: "Please enter a valid email address.",
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: "An account with this email already exists." });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //console.log(otp);
    await sendOTPEmail(email, otp);
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
};

exports.Verify = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!user) {
      user = await User.create({
        email,
        password: hashedPassword,
        isVerified: true,

        leetcodeUsername: "",

        targetCompanies: [],

        targetRole: "SDE",

        weakTopics: [],
      });

      const roadmap = await DSARoadmap.create({
        userId: user._id,

        title: "Core SDE DSA Preparation Roadmap",

        targetRole: user.targetRole,

        targetCompanies: [],

        difficulty: "Medium",

        topics: [],
      });

      user.selectedRoadmapId = roadmap._id;

      await user.save();
      await sendWelcomeEmail(email);
    }
    issueSession(res, user);
    res.json({
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required fields." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid email or password credentials." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid email or password credentials." });
    }

    issueSession(res, user);
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

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

    await sendOTPEmail(email, otp);

    res.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email });

    if (!record || record.otp !== otp || record.expiresAt < new Date()) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    res.json({
      message: "OTP verified",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const record = await OTP.findOne({ email });

    if (!record || record.otp !== otp || record.expiresAt < new Date()) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    await OTP.deleteOne({ email });

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    clearAuthCookie(res);
    res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
