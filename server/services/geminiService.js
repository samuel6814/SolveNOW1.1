const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in .env file");
}

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * GENERATE QUIZ FROM PDF
 * Accepts Base64 PDF data directly, allowing Gemini to "see" the layout.
 */
const generateQuiz = async (pdfBase64, numQuestions = 5, difficulty = "BSc Undergraduate") => {
  try {
    console.log("🤖 Sending PDF to Gemini (Vision Mode)...");

    const prompt = `
      You are a strict University Examiner.
      
      TASK:
      Analyze the attached PDF document. Generate a ${difficulty} level quiz with ${numQuestions} multiple-choice questions based *strictly* on the document content.

      REQUIREMENTS:
      1. **Context:** Read the entire document, including tables, diagrams, and math equations.
      2. **Detect Subject:** Identify the specific topic (e.g., "Linear Algebra", "Cell Biology").
      3. **Format:** Output MUST be a valid JSON Array.
      4. **Math:** Use LaTeX for any equations (e.g., $\\int$).
      5. **Structure:**
         [
           {
             "question": "Question text...",
             "options": ["A", "B", "C", "D"],
             "correct_answer": "Exact string match",
             "solution": "Explanation",
             "topic": "Detected Topic" 
           }
         ]
    `;

    const response = await client.models.generateContent({
      model: "gemini-flash-latest", 
      contents: [
        { text: prompt },
        { 
            inlineData: { 
                mimeType: "application/pdf", 
                data: pdfBase64 
            } 
        }
      ],
      config: {
        responseMimeType: "application/json", 
        temperature: 0.4,
      },
    });

    console.log("✅ Gemini Responded.");

    let text = response.text; 
    
    // Parse JSON
    try {
        const quizJson = JSON.parse(text);
        if (!Array.isArray(quizJson)) throw new Error("AI did not return an array.");
        return quizJson;
    } catch (parseError) {
        console.error("❌ JSON Parse Failed. Raw Text:", text);
        throw new Error("AI generated invalid JSON. Please try again.");
    }

  } catch (error) {
    console.error("❌ Gemini Service Error:", error);
    throw new Error("Failed to generate quiz from AI.");
  }
};

module.exports = { generateQuiz };