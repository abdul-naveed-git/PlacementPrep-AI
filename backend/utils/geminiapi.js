const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GoogleGenAI,
});

const getModelFallbacks = () => {
  const primaryModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const fallbackModels = (
    process.env.GEMINI_FALLBACK_MODELS || "gemini-2.5-flash-lite"
  )
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return [...new Set([primaryModel, ...fallbackModels])];
};

const generateJson = async (contents) => {
  const models = getModelFallbacks();
  let lastError;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: "application/json",
        },
      });

      return JSON.parse(response.text);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
};

module.exports = {
  ai,
  generateJson,
  getModelFallbacks,
};
