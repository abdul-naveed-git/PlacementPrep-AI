const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { experienceSchema } = require("../validation/schemas");
const {
  getExperiences,
  createExperience,
  upvoteExperience,
} = require("../controller/experienceController");

const router = express.Router();

router.get("/", getExperiences);
router.post(
  "/create",
  authMiddleware,
  validateRequest(experienceSchema),
  createExperience,
);
router.post("/:id/upvote", authMiddleware, upvoteExperience);

module.exports = router;
