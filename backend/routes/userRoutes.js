const express = require("express");
const router = express.Router();
const { getuser, postuser } = require("../controller/userController");
const { leetcodesync } = require("../controller/userController");
router.get("/profile", getuser);
router.post("/profile", postuser);
router.post("/leetcode/sync", leetcodesync);
module.exports = router;
