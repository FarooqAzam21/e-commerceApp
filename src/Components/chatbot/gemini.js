// src/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);

export const getChatModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 2048,
    },
  });
};
