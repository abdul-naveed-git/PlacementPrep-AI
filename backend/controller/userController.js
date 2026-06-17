const User = require("../models/User");
const { getLeetCodeStats } = require("../utils/leetcodeapi");

exports.getuser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.postuser = async (req, res) => {
  const { leetcodeUsername, targetCompanies, targetRole, weakTopics } =
    req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  user.leetcodeUsername = leetcodeUsername || user.leetcodeUsername;
  user.targetCompanies = targetCompanies || user.targetCompanies;
  user.targetRole = targetRole || user.targetRole;
  user.weakTopics = weakTopics || user.weakTopics;

  await user.save();

  res.json(user);
};

exports.leetcodesync = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (!user.leetcodeUsername) {
      return res.status(400).json({
        error: "Please add LeetCode username first",
      });
    }

    const stats = await getLeetCodeStats(user.leetcodeUsername);

    user.leetcodeStats = stats;

    await user.save();

    res.json({
      message: "Stats synced successfully",
      leetcodeStats: user.leetcodeStats,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
