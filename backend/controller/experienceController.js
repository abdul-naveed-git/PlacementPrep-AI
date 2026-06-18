const InterviewExperience = require("../models/InterviewExperience");
exports.getExperiences = async (req, res) => {
  try {
    const experiences = await InterviewExperience.find().sort({
      createdAt: -1,
    });

    res.json(experiences);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.createExperience = async (req, res) => {
  try {
    const { company, role, difficulty, title, content } = req.body;

    if (!company || !role || !difficulty || !title || !content) {
      return res.status(400).json({
        error: "All fields required",
      });
    }

    const experience = await InterviewExperience.create({
      authorEmail: req.user.email,
      company,
      role,
      difficulty,
      title,
      content,
      upvotes: 1,
      upvotedBy: [req.user.email],
    });

    res.status(201).json(experience);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.upvoteExperience = async (req, res) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        error: "Experience not found",
      });
    }

    const email = req.user.email;

    const already = experience.upvotedBy.includes(email);

    if (already) {
      experience.upvotedBy = experience.upvotedBy.filter((e) => e !== email);

      experience.upvotes--;
    } else {
      experience.upvotedBy.push(email);

      experience.upvotes++;
    }

    await experience.save();

    res.json(experience);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
