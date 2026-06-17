const mongoose = require("mongoose");

const InterviewExperienceSchema = new mongoose.Schema(
  {
    authorEmail: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    upvotes: {
      type: Number,
      default: 0,
    },

    upvotedBy: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "InterviewExperience",
  InterviewExperienceSchema,
);
