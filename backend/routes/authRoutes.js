const express = require("express");
const router = express.Router();
const validateRequest = require("../middleware/validateRequest");
const { authRequestSchemas } = require("../validation/schemas");
const {
  Register,
  Verify,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  logout,
} = require("../controller/authController");
router.post("/register", validateRequest(authRequestSchemas.register), Register);
router.post("/verify", validateRequest(authRequestSchemas.verify), Verify);
router.post("/login", validateRequest(authRequestSchemas.login), login);
router.post(
  "/forgot-password",
  validateRequest(authRequestSchemas.forgotPassword),
  forgotPassword,
);
router.post(
  "/verify-reset-otp",
  validateRequest(authRequestSchemas.verifyResetOtp),
  verifyResetOtp,
);
router.post(
  "/reset-password",
  validateRequest(authRequestSchemas.resetPassword),
  resetPassword,
);
router.post("/logout", logout);
module.exports = router;
