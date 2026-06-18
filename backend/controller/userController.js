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
  try {
    const {
      leetcodeUsername,
      targetCompanies,
      targetRole,
      weakTopics,
      fullName,
      academicYear,
      department,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isUsernameChanged =
      leetcodeUsername !== undefined && leetcodeUsername !== user.leetcodeUsername;

    user.leetcodeUsername =
      leetcodeUsername !== undefined ? leetcodeUsername : user.leetcodeUsername;
    user.targetCompanies =
      targetCompanies !== undefined ? targetCompanies : user.targetCompanies;
    user.targetRole = targetRole !== undefined ? targetRole : user.targetRole;
    user.weakTopics = weakTopics !== undefined ? weakTopics : user.weakTopics;
    user.fullName = fullName !== undefined ? fullName : user.fullName;
    user.academicYear =
      academicYear !== undefined ? academicYear : user.academicYear;
    user.department = department !== undefined ? department : user.department;

    if (isUsernameChanged && leetcodeUsername) {
      const stats = await getLeetCodeStats(leetcodeUsername);
      if (stats) {
        user.leetcodeStats = stats;
      }
    } else if (isUsernameChanged) {
      user.leetcodeStats = undefined;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
