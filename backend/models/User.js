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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);
