const fs = require('fs');
const path = require('path');
const { generateQuiz } = require('../services/geminiService');
const { query } = require('../utils/dbHelper');

exports.createQuiz = async (req, res) => {
    // FIX: Get userId from the JWT token (set by authMiddleware)
    // Fallback to req.body.userId only if testing without auth
    const userId = req.user ? req.user.userId : req.body.userId;
    
    // We now expect 'filename' from the frontend instead of raw text
    const { filename, title, difficulty = "BSc Undergraduate", numQuestions = 5 } = req.body;

    if (!filename || !userId) {
        console.error("Missing Data - Filename:", filename, "UserID:", userId);
        return res.status(400).json({ error: "Missing filename or user ID." });
    }

    try {
        console.log(`Generating quiz for User ${userId}: ${title}`);

        // 1. LOCATE THE FILE
        const filePath = path.join(__dirname, '../uploads', filename);

        if (!fs.existsSync(filePath)) {
            console.error("File not found at:", filePath);
            return res.status(404).json({ error: "PDF file not found on server." });
        }

        // 2. READ FILE AS BASE64 (Required for Gemini Vision)
        const pdfBuffer = fs.readFileSync(filePath);
        const base64Data = pdfBuffer.toString('base64');
        
        // 3. GENERATE QUESTIONS VIA AI (Sending Base64 instead of text)
        // Note: generateQuiz now accepts (base64String, numQuestions, difficulty)
        const generatedQuestions = await generateQuiz(base64Data, numQuestions, difficulty);

        if (!generatedQuestions || generatedQuestions.length === 0) {
            throw new Error("AI returned no questions.");
        }

        // 4. INSERT QUIZ METADATA
        // We use the topic detected by the first question, or default to "General"
        const detectedTopic = generatedQuestions[0].topic || "General";

        const quizResult = await query(
            `INSERT INTO quizzes (user_id, title, topic, difficulty) 
             VALUES ($1, $2, $3, $4) RETURNING quiz_id`,
            [userId, title || "Untitled Quiz", detectedTopic, difficulty]
        );

        // Handle ID retrieval (Works for both Postgres and SQLite wrappers)
        let quizId = quizResult.length ? quizResult[0].quiz_id : quizResult.id;
        if (!quizId && this.lastID) quizId = this.lastID; 

        // 5. INSERT QUESTIONS
        for (const q of generatedQuestions) {
            await query(
                `INSERT INTO questions (quiz_id, question_text, options, correct_answer, solution_explanation, metadata_tags)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    quizId,
                    q.question,
                    JSON.stringify(q.options),
                    q.correct_answer,
                    q.solution,
                    q.topic
                ]
            );
        }

        res.status(201).json({ 
            message: "Quiz generated successfully", 
            quizId: quizId,
            count: generatedQuestions.length 
        });

    } catch (error) {
        console.error("Quiz Creation Error:", error);
        res.status(500).json({ error: "Failed to generate quiz." });
    }
};

// ... existing getQuiz export remains unchanged ...
exports.getQuiz = async (req, res) => {
    const { id } = req.params;
    try {
        const quizMeta = await query('SELECT * FROM quizzes WHERE quiz_id = $1', [id]);
        if (!quizMeta || quizMeta.length === 0) {
            return res.status(404).json({ error: "Quiz not found" });
        }
        const questions = await query('SELECT * FROM questions WHERE quiz_id = $1', [id]);
        res.status(200).json({
            meta: quizMeta[0],
            questions: questions.map(q => ({
                ...q,
                options: JSON.parse(q.options)
            }))
        });
    } catch (error) {
        console.error("Fetch Quiz Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};