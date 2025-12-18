const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const gradeController = require('../controllers/gradeController'); // Ensure this is imported
const { authenticateToken } = require('../middleware/authMiddleware'); // The file we just made

// POST /api/quiz/generate 
// Protect this route so we get the userId for the database
router.post('/generate', authenticateToken, quizController.createQuiz);

// GET /api/quiz/:id
// Protect this so only logged-in users can view quizzes
router.get('/:id', authenticateToken, quizController.getQuiz);

// POST /api/quiz/submit
// Protect this so we can link the score to the specific student
router.post('/submit', authenticateToken, gradeController.submitQuiz);

module.exports = router;