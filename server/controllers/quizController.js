const { generateQuiz } = require('../services/geminiService');
const { query } = require('../utils/dbHelper');

exports.createQuiz = async (req, res) => {
    // FIX: Get userId from the JWT token (set by authMiddleware)
    // Fallback to req.body.userId only if testing without auth
    const userId = req.user ? req.user.userId : req.body.userId;
    const { textContent, title } = req.body;

    if (!textContent || !userId) {
        console.error("Missing Data - Text:", !!textContent, "UserID:", userId);
        return res.status(400).json({ error: "Missing text content or user ID." });
    }

    try {
        console.log(`Generating quiz for User ${userId}: ${title}`);
        
        // 1. Generate Questions via AI
        const generatedQuestions = await generateQuiz(textContent, 5);

        // 2. Insert Quiz Metadata
        const quizResult = await query(
            `INSERT INTO quizzes (user_id, title, topic, difficulty) 
             VALUES ($1, $2, $3, $4) RETURNING quiz_id`,
            [userId, title || "Untitled Quiz", generatedQuestions[0].topic, "BSc Undergraduate"]
        );

        // Handle ID retrieval
        let quizId = quizResult.length ? quizResult[0].quiz_id : quizResult.id;
        if (!quizId && this.lastID) quizId = this.lastID; 

        // 3. Insert Questions
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

// ... keep exports.getQuiz as it was ...
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