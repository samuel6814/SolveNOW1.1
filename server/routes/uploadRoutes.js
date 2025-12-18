const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Route: POST /api/upload
// Uses the middleware to save the file, then the controller to parse it
router.post('/', uploadController.uploadMiddleware, uploadController.processPdf);

module.exports = router;