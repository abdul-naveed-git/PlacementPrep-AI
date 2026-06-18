const express = require("express");
const router = express.Router();
const {
  Register,
  Verify,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} = require("../controller/authController");
router.post("/register", Register);
router.post("/verify", Verify);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
module.exports = router;
