// server.js

// Load env var
require('dotenv').config();

const { PORT } = require('./config/env');
const { connectDB } = require('./config/db');
const app = require('./app');

console.log('Starting backend server...');

// Check environment
console.log('Environment check:');
console.log('PORT:', PORT);

// Connect to database FIRST, then start server
connectDB()
    .then(function() {
        console.log('Database connected successfully');

        // Start server
        app.listen(PORT, function() {
            console.log('Server started on port', PORT);
            console.log('API available at: http://localhost:' + PORT);
        });
    })
    .catch(function(err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    });
