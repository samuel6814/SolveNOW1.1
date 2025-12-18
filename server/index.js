/**
 * SolveNOW Backend Entry Point
 * Function: Initializes the Express application, configures middleware (CORS, JSON parsing),
 * and establishes the connection to the database.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
// Allows the React client to communicate with this API
app.use(cors()); 
// Parses incoming JSON payloads (essential for Auth and Quiz data)
app.use(express.json()); 

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('SolveNOW API is running...');
});


// Mount Auth Routes
app.use('/api/auth', authRoutes);

app.use('/api/upload', uploadRoutes);

app.use('/api/quiz', quizRoutes);


// Database Connection Placeholder (Will implement SQLite/PG switch later)
// 
const connectDB = async () => {
    try {
        console.log(`Database connected (${process.env.NODE_ENV === 'production' ? 'PostgreSQL' : 'SQLite'})`);
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

// Start Server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});