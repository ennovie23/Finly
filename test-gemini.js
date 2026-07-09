require('dotenv').config({path: '.env'});
const { GoogleGenAI } = require('@google/genai');
async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: ['Say hi'],
    });
    console.log("type of response.text:", typeof response.text);
    console.log("response.text:", typeof response.text === 'function' ? response.text() : response.text);
  } catch(e) {
    console.error(e);
  }
}
run();
