const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: ['Respond with a JSON object containing {"hello": "world"}. Do not use markdown.'],
    });
    console.log("Raw response object keys:", Object.keys(response));
    console.log("response.text getter:", response.text);
  } catch(e) {
    console.error("Error:", e);
  }
}
run();
