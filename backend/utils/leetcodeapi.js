const BASE_URL = "https://alfa-leetcode-api.onrender.com";

exports.getLeetCodeStats = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/${username}/profile`);

    if (!response.ok) {
      throw new Error("Unable to fetch profile");
    }

    const data = await response.json();

    return {
      username,
      totalSolved: data.totalSolved || 0,
      easySolved: data.easySolved || 0,
      mediumSolved: data.mediumSolved || 0,
      hardSolved: data.hardSolved || 0,
      ranking: data.ranking || 0,
      reputation: data.reputation || 0,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
exports.getProfile = async (username) => {
  const res = await fetch(`${BASE_URL}/${username}/profile`);
  return await res.json();
};

exports.getSolved = async (username) => {
  const res = await fetch(`${BASE_URL}/${username}/solved`);
  return await res.json();
};

exports.getContest = async (username) => {
  const res = await fetch(`${BASE_URL}/${username}/contest`);
  return await res.json();
};

exports.getContestHistory = async (username) => {
  const res = await fetch(`${BASE_URL}/${username}/contest/history`);
  return await res.json();
};

exports.getSubmissions = async (username, limit = 20) => {
  const res = await fetch(`${BASE_URL}/${username}/submission?limit=${limit}`);
  return await res.json();
};

exports.getAcceptedSubmissions = async (username, limit = 20) => {
  const res = await fetch(
    `${BASE_URL}/${username}/acSubmission?limit=${limit}`,
  );
  return await res.json();
};

exports.getCalendar = async (username, year) => {
  const url = year
    ? `${BASE_URL}/${username}/calendar?year=${year}`
    : `${BASE_URL}/${username}/calendar`;

  const res = await fetch(url);
  return await res.json();
};

exports.getSkillStats = async (username) => {
  const res = await fetch(`${BASE_URL}/${username}/skill`);
  return await res.json();
};

exports.getLanguageStats = async (username) => {
  const res = await fetch(`${BASE_URL}/${username}/language`);
  return await res.json();
};

exports.getQuestionProgress = async (username) => {
  const res = await fetch(`${BASE_URL}/${username}/progress`);
  return await res.json();
};
