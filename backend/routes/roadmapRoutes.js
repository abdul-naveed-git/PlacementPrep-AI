const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getRoadmap,

  toggleProblem,

  generateRoadmap,

  getRecommendedProblems,

  toggleRecommendedProblem,

  getTopPatterns,

  togglePattern,
} = require("../controller/roadmapController");
router.use(authMiddleware);

router.get("/", getRoadmap);

router.post("/generate", generateRoadmap);

router.post("/problem/toggle", toggleProblem);

router.get("/recommended", getRecommendedProblems);

router.post("/recommended/toggle", toggleRecommendedProblem);

router.get("/patterns", getTopPatterns);

router.post("/patterns/toggle", togglePattern);
module.exports = router;
