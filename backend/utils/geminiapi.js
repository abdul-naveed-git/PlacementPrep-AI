const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: process.env.GoogleGenAI,
});
module.exports = ai;
