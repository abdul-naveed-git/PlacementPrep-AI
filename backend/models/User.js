const mongoose = require("mongoose");

const LeetCodeStatsSchema = new mongoose.Schema(
  {
    username: String,
    totalSolved: {
      type: Number,
      default: 0,
    },
    easySolved: {
      type: Number,
      default: 0,
    },
    mediumSolved: {
      type: Number,
      default: 0,
    },
    hardSolved: {
      type: Number,
      default: 0,
    },
    ranking: {
      type: Number,
      default: 0,
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    fullName: {
      type: String,
      default: "",
    },
    academicYear: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    leetcodeUsername: {
      type: String,
    },

    leetcodeStats: LeetCodeStatsSchema,

    targetCompanies: [
      {
        type: String,
      },
    ],

    targetRole: {
      type: String,
      default: "",
    },

    weakTopics: [
      {
        type: String,
      },
    ],

    selectedRoadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DSARoadmap",
    },
    recommendedProblems: [
      {
        id: String,

        title: String,

        url: String,

        difficulty: String,

        topic: String,

        rationale: String,

        completed: Boolean,
      },
    ],
    topPatterns: [
      {
        id: String,

        patternName: String,

        description: String,

        keyInsight: String,

        sampleProblem: String,

        mastered: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);
