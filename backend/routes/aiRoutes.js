const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  summarizeComments,
  summarizeGroup,
  summarizeCompany,
  analyzeSkills,
} = require("../controller/aiController");

const router = express.Router();

router.post("/summarize-comments", authMiddleware, summarizeComments);
router.post("/summarize-group", authMiddleware, summarizeGroup);
router.post("/summarize-company", authMiddleware, summarizeCompany);
router.post("/analyze-skills", authMiddleware, analyzeSkills);

module.exports = router;
