const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../utils/dbHelper');

// Validates email format
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

/**
 * REGISTER User
 * Logic: Hashes password -> Saves to DB -> Returns JWT
 * [cite_start]PRD Reference: 4.0 User Authentication [cite: 31, 32]
 */
exports.register = async (req, res) => {
    console.log("➡️ Register Request Received:", req.body.email); 

    const { username, email, password } = req.body;

    // 1. Validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    try {
        // 2. Check if user already exists
        console.log("🔍 Checking for existing user...");
        const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (existingUser.length > 0) {
            console.log("⚠️ User already exists.");
            return res.status(409).json({ error: "User already exists." });
        }

        // 3. Hash Password (bcrypt)
        console.log("🔑 Hashing password...");
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 4. Insert into Database
        console.log("💾 Inserting into DB...");
        // SQLite returns an object with { id: lastID }, Postgres returns rows if RETURNING used
        const result = await query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
            [username, email, passwordHash]
        );

        // CRITICAL FIX: Retrieve the new user ID
        // In SQLite via our helper, 'result.id' holds the lastID.
        let newUserId = result.id; 
        
        // Fallback: If we didn't get an ID back (e.g. Postgres without RETURNING), fetch it manually.
        if (!newUserId) {
             console.log("⚠️ ID not returned directly, fetching manually...");
             const userLookup = await query('SELECT user_id FROM users WHERE email = $1', [email]);
             if (userLookup.length > 0) newUserId = userLookup[0].user_id;
        }

        console.log("✅ Registration Successful. New ID:", newUserId);

        // 5. Generate JWT Token
        // FIX: Include userId in the payload so middleware works immediately
        const token = jwt.sign(
            { userId: newUserId, email: email }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            message: "User registered successfully", 
            token,
            user: { 
                id: newUserId, // Return ID to frontend
                username, 
                email 
            } 
        });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * LOGIN User
 * Logic: Finds user -> Compares Hash -> Returns JWT
 * PRD Reference: 4.0 User Authentication
 */
exports.login = async (req, res) => {
    console.log("➡️ Login Request Received:", req.body.email);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        // 1. Find User
        const users = await query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (users.length === 0) {
            console.log("⚠️ User not found.");
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const user = users[0];

        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            console.log("⚠️ Password incorrect.");
            return res.status(401).json({ error: "Invalid credentials." });
        }

        console.log("✅ Login Successful for ID:", user.user_id);

        // 3. Generate Token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};