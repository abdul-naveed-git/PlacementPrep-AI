const express = require("express");
const router = express.Router();
const { Register, Verify, login } = require("../controller/authController");
router.post("/register", Register);
router.post("/verify", Verify);
router.post("/login", login);
module.exports = router;
