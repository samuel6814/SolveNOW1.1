const db = require('../db.config');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Unified Database Query Function
 * Function: Abstracts the difference between PostgreSQL (Promises) and SQLite (Callbacks).
 * Returns: A Promise that resolves to the query results.
 */
const query = (text, params = []) => {
    return new Promise((resolve, reject) => {
        if (isProduction) {
            // PostgreSQL Strategy
            db.query(text, params)
                .then(res => resolve(res.rows))
                .catch(err => reject(err));
        } else {
            // SQLite Strategy
            // Convert Postgres-style $1, $2 placeholders to SQLite ? placeholders
            const sqliteText = text.replace(/\$\d+/g, '?');
            
            if (text.trim().toUpperCase().startsWith('SELECT')) {
                db.all(sqliteText, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            } else {
                // For INSERT, UPDATE, DELETE
                db.run(sqliteText, params, function (err) {
                    if (err) reject(err);
                    // 'this' context in sqlite3 contains changes/lastID
                    else resolve({ id: this.lastID, changes: this.changes }); 
                });
            }
        }
    });
};

module.exports = { query };