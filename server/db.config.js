/**
 * Database Configuration
 * Function: Determines which database to connect to based on the NODE_ENV.
 * Returns a connection configuration object.
 */

const { Pool } = require('pg'); // For PostgreSQL
const sqlite3 = require('sqlite3').verbose(); // For SQLite

const isProduction = process.env.NODE_ENV === 'production';

let db;

if (isProduction) {
    // Production: PostgreSQL via Neon [cite: 22]
    db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    // Development: SQLite [cite: 21]
    // Creates a local file named 'solvenow.db' in the server folder
    db = new sqlite3.Database('./solvenow.db', (err) => {
        if (err) {
            console.error('Error opening SQLite database', err.message);
        } else {
            console.log('Connected to the SQLite database.');
        }
    });
}

module.exports = db;