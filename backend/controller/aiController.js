const { generateJson } = require("../utils/geminiapi");

const User = require("../models/User");

const InterviewExperience = require("../models/InterviewExperience");
const summarizeComments = async (req, res) => {
  try {
    const {
      title,

      comments,
    } = req.body;

    if (!comments) {
      return res.status(400).json({
        error: "Comments required",
      });
    }

    const commentsText = comments

      .map((c) => `${c.author}:${c.text}`)

      .join("\n");

    const prompt = `You are an expert tech recruiter and interview preparation coach.
Below is a thread of candidate and mentor discussion comments regarding the interview experience titled "${title}":

${commentsText}

Please summarize these peer comments to help other candidates prepare.
Provide a clear, high-yield summary in JSON format with exactly three lists:
1. "coreQuestions": 2-3 most critical questions peers asked in this thread.
2. "takeaways": 2-3 main insights or answers gathered from the thread.
3. "prepFocus": 1-2 key items candidates should focus on during their preparation based on what was discussed.

Response MUST be ONLY a valid JSON object matching this schema template:
{
  "coreQuestions": ["Question A", "Question B"],
  "takeaways": ["Advice 1", "Advice 2"],
  "prepFocus": ["Topic 1", "Topic 2"]
}`;

    const result = await generateJson(prompt);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const summarizeGroup = async (req, res) => {
  try {
    const { experiences } = req.body;

    const experiencesText = (experiences || [])

      .map(
        (e) =>
          `

Company:${e.company}

Role:${e.role}

${e.content || e.description || ""}

`,
      )

      .join("\n");

    const prompt = `You are an elite developer recruitment panel director. 
Analyze the following group of interview experiences collectively:

${experiencesText}

Please synthesize these experiences into a high-level aggregate summary highlighting major preparation themes.
Provide a clear, high-yield summary in JSON format with exactly:
1. "commonPatterns": 3-4 structural patterns or round progressions noted across these experiences.
2. "frequentQuestions": 3-4 specific technical algorithms, system architectures, or skills frequently audited.
3. "optimizedPreparationTips": 3-4 actionable tips and execution blueprints to crack these interviews.
4. "difficultyRating": A short, aggregate difficulty evaluation (e.g., "Intermediate to Advanced", "Solid Medium-Hard").

Response MUST be ONLY a valid JSON object matching this schema template:
{
  "commonPatterns": ["Pattern 1", "Pattern 2"],
  "frequentQuestions": ["Topic/Question A", "Topic/Question B"],
  "optimizedPreparationTips": ["Tip 1", "Tip 2"],
  "difficultyRating": "e.g. Medium-Hard"
}`;

    res.json(await generateJson(prompt));
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const summarizeCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    const experiences = await InterviewExperience.find({
      company: {
        $regex: new RegExp(
          companyName,

          "i",
        ),
      },
    });

    const experiencesText = experiences

      .map((e) => e.content)

      .join("\n");

    const prompt = `You are an AI Interview Coach. Read the following interview experiences submitted for the company "${companyName}":
${experiencesText}

Please summarize these experiences into a beautiful JSON structure that highlights:
1. Round-wise typical stage schedules (explain typical Technical Round 1 focus topics, Technical Round 2, and bar-raiser/HM rounds).
2. "commonMistakes" typically made by applicants (list 3 clear tips).
3. "frequentlyAskedTopics" with an estimate of their frequency ("High", "Medium", "Low").

Response must be ONLY valid JSON matching this schema:
{
  "companyName": "${companyName}",
  "roundWiseSummaries": [
    {
      "roundName": "Round Title (e.g. Coding Assessment)",
      "focusTopics": ["Topic A", "Topic B"],
      "details": "Explanation of interview setting and typical expectations."
    }
  ],
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "frequentlyAskedTopics": [
    { "topic": "Graph Algorithms", "frequency": "High" }
  ],
  "lastUpdated": "${new Date().toLocaleDateString()}"
}`;

    res.json(await generateJson(prompt));
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const analyzeSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const totalSolved = user?.leetcodeStats?.totalSolved || 0;
    const targetCompanies = user?.targetCompanies || [];
    const weakTopics = user?.weakTopics || [];

    const prompt = `You are an elite Tech Career mentor. Evaluate this student:
- Solved Leetcode Questions: ${totalSolved} total
- Targeted Tech Companies: [${targetCompanies.join(", ")}]
- Target SDE Role: "${user.targetRole}"
- Stated Weak Areas: [${weakTopics.join(", ")}]

Please run an AI Skill Gap Analysis. Compare their current skill profile with the standard interview complexity expectation of their targeted tech companies. Identify specific critical weak DSA topics (at least 3), assign them a skill score percentage (0-100) representing where they are versus company expectations, and map out 3 high-priority improvement items with clear details.

Response must be ONLY valid JSON matching this schema:
{
  "skillLevelPercent": 45,
  "comparisonChartData": [
    { "topicName": "Graphs", "studentSkill": 35, "companyExpectation": 85 },
    { "topicName": "Dynamic Programming", "studentSkill": 25, "companyExpectation": 90 },
    { "topicName": "Recursion", "studentSkill": 60, "companyExpectation": 80 },
    { "topicName": "System Design", "studentSkill": 40, "companyExpectation": 75 },
    { "topicName": "Greedy", "studentSkill": 70, "companyExpectation": 80 }
  ],
  "identifiedGaps": [
    {
      "topic": "Graph Algorithms",
      "gapDescription": "Struggles with cycles detection and topological sorting which are high frequency patterns at Google and Uber.",
      "priority": "Critical"
    }
  ],
  "priorityRecommendations": [
    "Solve 10 medium-level DFS/BFS cycle detection problems",
    "Study Floyd-Warshall and Bellman-Ford algorithms for shortest path variations"
  ]
}`;

    res.json(await generateJson(prompt));
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
module.exports = {
  summarizeComments,

  summarizeGroup,

  summarizeCompany,

  analyzeSkills,
};
