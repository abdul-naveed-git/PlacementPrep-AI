const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getExperiences,
  createExperience,
  upvoteExperience,
} = require("../controller/experienceController");

const router = express.Router();

router.get("/", getExperiences);
router.post("/create", authMiddleware, createExperience);
router.post("/:id/upvote", authMiddleware, upvoteExperience);

module.exports = router;
