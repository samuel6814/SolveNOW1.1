const { query } = require('../utils/dbHelper');

/**
 * SUBMIT QUIZ
 * Logic:
 * 1. Calculate Score (Compare user answers to DB correct_answers).
 * 2. Save Attempt to 'attempts' table.
 * 3. Return Score + Full Solution Explanations.
 */
exports.submitQuiz = async (req, res) => {
    const { quizId, userAnswers, timeSpent } = req.body;
    const userId = req.user.userId; // Extracted from JWT middleware

    try {
        // 1. Fetch Correct Answers & Solutions
        const questions = await query(
            'SELECT question_id, correct_answer, solution_explanation FROM questions WHERE quiz_id = $1',
            [quizId]
        );

        let score = 0;
        const results = questions.map(q => {
            const userAnswer = userAnswers[q.question_id - 1]; // distinct by index or ID mapping
            // Note: In prod, map strictly by question_id. 
            // For this prototype, we assume the array order matches.
            
            // Simple string comparison
            const isCorrect = userAnswer === q.correct_answer;
            if (isCorrect) score++;

            return {
                question_id: q.question_id,
                isCorrect,
                userAnswer,
                correctAnswer: q.correct_answer,
                explanation: q.solution_explanation
            };
        });

        // 2. Save Attempt
        await query(
            `INSERT INTO attempts (user_id, quiz_id, score, total_questions, time_spent_seconds) 
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, quizId, score, questions.length, timeSpent]
        );

        // 3. Return Results
        res.status(200).json({
            score,
            total: questions.length,
            percentage: Math.round((score / questions.length) * 100),
            details: results
        });

    } catch (error) {
        console.error("Grading Error:", error);
        res.status(500).json({ error: "Failed to grade quiz." });
    }
};