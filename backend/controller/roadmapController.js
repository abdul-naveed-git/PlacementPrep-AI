const User = require("../models/User");
const DSARoadmap = require("../models/DSARoadmap");
const { generateJson } = require("../utils/geminiapi");

const getRoadmap = async (req, res) => {
  try {
    const difficulty = req.query.difficulty || "Medium";

    let roadmap = await DSARoadmap.findOne({
      userId: req.user.id,
      difficulty,
    });

    if (!roadmap) {
      roadmap = await DSARoadmap.findOne({
        userId: req.user.id,
      }).sort({ updatedAt: -1 });
    }

    if (!roadmap) {
      return res.status(404).json({
        error: "Roadmap not found",
      });
    }

    res.json(roadmap);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
const toggleProblem = async (req, res) => {
  try {
    const { problemId, completed, roadmapId } = req.body;
    const user = await User.findById(req.user.id).select("selectedRoadmapId");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const roadmapQuery = {
      userId: req.user.id,
      ...(roadmapId || user.selectedRoadmapId
        ? { _id: roadmapId || user.selectedRoadmapId }
        : {}),
    };

    let roadmap = await DSARoadmap.findOne(roadmapQuery);

    if (!roadmap && !roadmapId && !user.selectedRoadmapId) {
      roadmap = await DSARoadmap.findOne({
        userId: req.user.id,
      }).sort({ updatedAt: -1 });
    }

    if (!roadmap) {
      return res.status(404).json({
        error: "Roadmap not found",
      });
    }

    let found = false;

    for (const topic of roadmap.topics) {
      const problem = topic.problems.find((p) => p.id === problemId);

      if (problem) {
        problem.completed = completed;

        const total = topic.problems.length;

        const done = topic.problems.filter((p) => p.completed).length;

        if (done === total) {
          topic.status = "completed";
        } else if (done > 0) {
          topic.status = "in-progress";
        } else {
          topic.status = "pending";
        }

        found = true;

        break;
      }
    }

    if (!found) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    await roadmap.save();

    res.json(roadmap);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const generateRoadmap = async (req, res) => {
  try {
    const difficulty = req.body.difficulty || "Medium";

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const targetCompanies = user.targetCompanies.join(", ");

    const weakTopics = user.weakTopics.join(", ");
    const stats = user.leetcodeStats;
    const leetcodeStatsInfo = stats
      ? `${stats.totalSolved || 0} solved (${stats.easySolved || 0} easy, ${stats.mediumSolved || 0} medium, ${stats.hardSolved || 0} hard)`
      : "No LeetCode stats connected yet";

    const prompt = `You are an expert tech team lead and DSA coach creating a personalized study roadmap for a student.
Please generate a roadmap EXACTLY for difficulty level: "${difficulty}".
Student Target companies: [${targetCompanies}]
Target Role: "${user.targetRole}"
Identified Weak Tech Topics: [${weakTopics}]
Connected LeetCode Stats: ${leetcodeStatsInfo}

Please design a structured 4-topic custom DSA roadmap corresponding to the difficulty "${difficulty}".
- If the difficulty is "Easy", keep topics simpler (e.g. Basic Array Searching, Frequency Dictionary, Fundamental Stacks) and problem recommendations mostly "Easy" (with occasional "Medium").
- If the difficulty is "Medium", generate intermediate complex topics (e.g. Backtracking, sliding window, depth first traversals) and problems predominantly "Medium" (with some "Easy").
- If the difficulty is "Hard", generate highly advanced/expert topics (e.g. 2D DP, Segment Trees, Network Flows, Hard Monotonic Queues) and problems mostly "Hard".

For each topic, supply a description of why it is vital for their target companies, a topic completion status ("pending"), and exactly 3 highly relevant LeetCode problem recommendations (with their difficulty matches, each with a valid leetcode URL slug/title).

You must respond ONLY with a valid JSON array of topics matching this schema structures:
[
  {
    "topicName": "Topic Title (e.g. Dynamic Programming)",
    "status": "pending",
    "problems": [
      {
        "id": "gen_problem_unique_id",
        "title": "Problem Title",
        "url": "Leetcode challenge link",
        "difficulty": "Easy",
        "completed": false,
        "topic": "Topic Title"
      }
    ]
  }
]`;

    const topics = await generateJson(prompt);

    const normalizedTopics = topics.map((topic, topicIndex) => ({
      ...topic,
      problems: (topic.problems || []).map((problem, problemIndex) => ({
        ...problem,
        id: problem.id || `topic_${topicIndex + 1}_problem_${problemIndex + 1}`,
        completed: Boolean(problem.completed),
        topic: problem.topic || topic.topicName,
      })),
    }));

    const roadmap = await DSARoadmap.findOneAndUpdate(
      {
        userId: user._id,

        difficulty,
      },

      {
        userId: user._id,

        difficulty,

        title: `AI ${difficulty} Roadmap`,

        targetRole: user.targetRole,

        targetCompanies: user.targetCompanies,

        topics: normalizedTopics,
      },

      {
        upsert: true,

        new: true,
      },
    );

    user.selectedRoadmapId = roadmap._id;

    await user.save();

    res.json(roadmap);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
const getRecommendedProblems = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const targetCompanies = user.targetCompanies || [];
    const weakTopics = user.weakTopics || [];

    if (user.recommendedProblems && user.recommendedProblems.length) {
      return res.json(user.recommendedProblems);
    }

    const prompt = `You are an elite developer recruitment panel director. 
Create exactly 6 highly tailored, high-yield LeetCode problem recommendations for a candidate seeking a "${user.targetRole}" position at these target companies: [${targetCompanies}].
Focus heavily on bridging gap variables for their weak areas: [${weakTopics}].
Provide exactly:
- 2 Easy problems
- 3 Medium problems
- 1 Hard problem

Each must have a valid LeetCode slug, description/rationale of why it fits their profile, its primary topic focus, and completed status set to false.

Response must be ONLY a valid JSON array of objects matches:
[
  {
    "id": "rec_id_string_constant",
    "title": "Problem Title",
    "url": "https://leetcode.com/problems/slug/",
    "difficulty": "Easy",
    "topic": "Topic Name",
    "rationale": "High-yield brief statement of why the company audits this problem",
    "completed": false
  }
]`;

    const problems = await generateJson(prompt);

    user.recommendedProblems = problems;

    await user.save();

    res.json(problems);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
const toggleRecommendedProblem = async (req, res) => {
  const { problemId, completed } = req.body;
  const user = await User.findById(req.user.id);
  const problem = user.recommendedProblems.find((p) => p.id === problemId);

  if (!problem) {
    return res.status(404).json({
      error: "Problem not found",
    });
  }
  problem.completed = completed;

  await user.save();

  res.json(user.recommendedProblems);
};

const getTopPatterns = async (req, res) => {
  const user = await User.findById(req.user.id);
  const targetCompanies = user.targetCompanies || [];
  const weakTopics = user.weakTopics || [];

  if (user.topPatterns && user.topPatterns.length) {
    return res.json(user.topPatterns);
  }

  const prompt = `You are a Principal Software Engineer and System Architect.
Examine this student's preparation profile:
- Target Role: "${user.targetRole}"
- Target Companies: [${targetCompanies}]
- Identified priority weak topics: [${weakTopics}]

Generate exactly 3 high-impact coding pattern cards that are highly critical for mastering these areas during SDE tests.
Each pattern must include:
1. "id": uniquely named string constant (e.g. "pattern_sliding_window")
2. "patternName": Clean recognizable pattern title (e.g. "Sliding Window Protocol", "Monotonic Stack", "Graph BFS Shortest Paths")
3. "description": Direct architectural description explaining what the pattern optimizes (e.g. from quadratic time down to linear time complexity).
4. "keyInsight": actionable wisdom summarizing the blueprint mechanics.
5. "sampleProblem": Name of a prominent related LeetCode puzzle (e.g. "Longest Substring Without Repeating Characters").
6. "mastered": false status initially.

Response must be ONLY a valid JSON array of objects matches:
[
  {
    "id": "pattern_id",
    "patternName": "Pattern Name",
    "description": "Architectural description of optimization...",
    "keyInsight": "Direct execution blueprint...",
    "sampleProblem": "Leetcode sample problem title",
    "mastered": false
  }
]`;

  const patterns = await generateJson(prompt);

  user.topPatterns = patterns;

  await user.save();

  res.json(patterns);
};

const togglePattern = async (req, res) => {
  const {
    patternId,

    mastered,
  } = req.body;

  const user = await User.findById(req.user.id);

  const pattern = user.topPatterns.find((p) => p.id === patternId);

  if (!pattern) {
    return res.status(404).json({
      error: "Pattern not found",
    });
  }

  pattern.mastered = mastered;

  await user.save();

  res.json(user.topPatterns);
};
module.exports = {
  getRoadmap,

  toggleProblem,

  generateRoadmap,

  getRecommendedProblems,

  toggleRecommendedProblem,

  getTopPatterns,

  togglePattern,
};
