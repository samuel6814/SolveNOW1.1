const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * GENERATE QUIZ
 * Function: Sends text context to Gemini and requests a structured JSON quiz.
 * PRD Reference: 4.2 Quiz Generation Engine
 * * @param {string} textContext - The raw text extracted from the PDF
 * @param {number} numQuestions - Number of questions to generate (default 10 for MVP)
 * @param {string} difficulty - "BSc Undergraduate" (hardcoded for now as per PRD)
 */
const generateQuiz = async (textContext, numQuestions = 5, difficulty = "BSc Undergraduate") => {
  try {
    // We use 'gemini-1.5-flash' for speed, or 'gemini-pro' for complex reasoning.
    // Flash is generally sufficient and faster for JSON generation.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- The Prompt Engineering (Crucial for Section 4.2) ---
    const prompt = `
      You are a strict University Mathematics Professor. 
      Analyze the following text content from a textbook/lecture note:
      
      "${textContext.substring(0, 30000)}..." (Truncated for safety)

      Task: Generate a ${difficulty} level quiz with ${numQuestions} multiple-choice questions based on this text.
      
      Constraints:
      1. COMPLEXITY: Questions must involve calculus, linear algebra, or proofs if the text supports it. Avoid simple arithmetic.
      2. FORMAT: Output strictly valid JSON. Do not include markdown formatting (like \`\`\`json). Just the raw JSON array.
      3. MATH: Use LaTeX notation for all mathematical symbols (e.g., use $\\int$ instead of "integral"). 
      4. STRUCTURE: 
         Each object in the array must have:
         - "question": String (The problem statement with LaTeX)
         - "options": Array of 4 Strings (Distractors must be plausible)
         - "correct_answer": String (Must match one of the options exactly)
         - "solution": String (Step-by-step logic explaining WHY, using LaTeX)
         - "topic": String (e.g., "Calculus", "Linear Algebra")

      Output the JSON Array only.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Cleanup: Sometimes models wrap JSON in markdown blocks despite instructions
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate quiz from AI.");
  }
};

module.exports = { generateQuiz };