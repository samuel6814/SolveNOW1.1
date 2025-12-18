const fs = require('fs');
const path = require('path');
const db = require('./db.config');

const schemaPath = path.join(__dirname, 'schema.sql');

try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('⏳ Initializing Database Tables...');
    
    // Run the SQL commands
    db.exec(schemaSql, (err) => {
        if (err) {
            console.error('❌ Error creating tables:', err.message);
        } else {
            console.log('✅ Tables created successfully!');
            console.log('Please restart your server now.');
        }
    });

} catch (err) {
    console.error("Could not read schema.sql. Make sure it exists in the server folder.", err);
}