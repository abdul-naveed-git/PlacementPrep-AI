const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  summarizeCommentsSchema,
  summarizeGroupSchema,
  summarizeCompanySchema,
} = require("../validation/schemas");
const {
  summarizeComments,
  summarizeGroup,
  summarizeCompany,
  analyzeSkills,
} = require("../controller/aiController");

const router = express.Router();

router.post(
  "/summarize-comments",
  authMiddleware,
  validateRequest(summarizeCommentsSchema),
  summarizeComments,
);
router.post(
  "/summarize-group",
  authMiddleware,
  validateRequest(summarizeGroupSchema),
  summarizeGroup,
);
router.post(
  "/summarize-company",
  authMiddleware,
  validateRequest(summarizeCompanySchema),
  summarizeCompany,
);
router.post("/analyze-skills", authMiddleware, analyzeSkills);

module.exports = router;
