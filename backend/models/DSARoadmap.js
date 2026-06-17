const mongoose = require("mongoose");

const DSAProblemSchema = new mongoose.Schema(
  {
    title: String,

    url: String,

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },

    completed: {
      type: Boolean,
      default: false,
    },

    topic: String,
  },
  { _id: false },
);

const DSATopicSchema = new mongoose.Schema(
  {
    topicName: String,

    status: {
      type: String,
      enum: ["pending", "completed", "in-progress"],
      default: "pending",
    },

    problems: [DSAProblemSchema],
  },
  { _id: false },
);

const DSARoadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    targetCompanies: [
      {
        type: String,
      },
    ],

    topics: [DSATopicSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("DSARoadmap", DSARoadmapSchema);
