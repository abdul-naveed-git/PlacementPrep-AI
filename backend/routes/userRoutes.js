const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getuser, postuser } = require("../controller/userController");
const { leetcodesync } = require("../controller/userController");
router.get("/profile", authMiddleware, getuser);
router.post("/profile", authMiddleware, postuser);
router.post("/leetcode/sync", authMiddleware, leetcodesync);
module.exports = router;
