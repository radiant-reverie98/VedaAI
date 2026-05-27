import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});


// VALIDATE SINGLE QUESTION
const validateQuestion = (question) => {

  // Common required fields
  if (
    !question.type ||
    !question.question ||
    !question.marks
  ) {
    return false;
  }

  // MCQ validation
  if (
    question.type.toLowerCase().includes("mcq")
  ) {

    if (
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      !question.answer
    ) {
      return false;
    }

  }

  return true;

};



// MAIN AI SERVICE
export const generateQuestionsWithAI = async ({
  extractedText,
  questionConfig,
}) => {

  try {

    // ================================
    // LIMIT TEXT SIZE
    // ================================
    const limitedText =
      extractedText.slice(0, 15000);

    // ================================
    // BUILD QUESTION INSTRUCTIONS
    // ================================
    const questionInstructions =
      questionConfig
        .map(
          (q) =>
            `- ${q.count} ${q.type} questions of ${q.marks} marks each`
        )
        .join("\n");

    // ================================
    // FINAL PROMPT
    // ================================
    const prompt = `
You are an expert teacher and assessment creator.

Generate questions ONLY from the provided study material.

STRICT RULES:
1. Return ONLY valid JSON.
2. Do not add markdown.
3. Do not add explanation text.
4. Do not hallucinate outside study material.
5. Follow the requested number of questions exactly.
6. Each question object must contain:
   - type
   - question
   - marks

7. MCQ questions must also contain:
   - options
   - answer

Question Requirements:
${questionInstructions}

Study Material:
${limitedText}

Expected JSON format:
[
  {
    "type": "MCQ",
    "question": "What is DBMS?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Option A",
    "marks": 1
  },
  {
    "type": "Short Question",
    "question": "Explain normalization.",
    "marks": 2
  }
]
`;

    // ================================
    // GEMINI API CALL
    // ================================
    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();

    // ================================
    // CLEAN RESPONSE
    // ================================
    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ================================
    // PARSE JSON
    // ================================
    let parsedQuestions;

    try {

      parsedQuestions =
        JSON.parse(cleanedResponse);

    } catch (parseError) {

      console.log(
        "JSON Parse Error:",
        parseError
      );

      console.log(
        "Raw AI Response:",
        cleanedResponse
      );

      throw new Error(
        "Invalid AI JSON response"
      );

    }

    // ================================
    // VALIDATE ARRAY
    // ================================
    if (
      !Array.isArray(parsedQuestions)
    ) {

      throw new Error(
        "AI response is not an array"
      );

    }

    // ================================
    // VALIDATE EACH QUESTION
    // ================================
    const invalidQuestion =
      parsedQuestions.find(
        (question) =>
          !validateQuestion(question)
      );

    if (invalidQuestion) {

      console.log(
        "Invalid Question:",
        invalidQuestion
      );

      throw new Error(
        "AI generated invalid question format"
      );

    }

    // ================================
    // RETURN CLEAN QUESTIONS
    // ================================
    return parsedQuestions;

  } catch (error) {

    console.log(
      "AI Generation Error:",
      error
    );

    throw error;

  }

};

export { model };