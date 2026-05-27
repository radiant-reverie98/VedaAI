import dotenv from 'dotenv'
dotenv.config()
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const generateQuestionsWithAI = async ({
  extractedText,
  questionConfig,
}) => {

  try {

    // Build dynamic question instructions
    const questionInstructions = questionConfig
      .map(
        (q) =>
          `- ${q.count} ${q.type} questions of ${q.marks} marks each`
      )
      .join("\n");

    // Final AI Prompt
    const prompt = `
You are an expert teacher.

Generate questions ONLY from the provided study material.

Question Requirements:
${questionInstructions}

Study Material:
${extractedText}

Return response STRICTLY in JSON array format.

Example:
[
  {
    "type": "mcq",
    "question": "What is DBMS?",
    "options": ["A", "B", "C", "D"],
    "answer": "A",
    "marks": 1
  }
]
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return response;

  } catch (error) {

    console.log("AI Generation Error:", error);

    throw error;

  }

};

export {model}