// server.js

// Load env var
require('dotenv').config();

const {PORT} = require('./config/env');
const {connectDB} = require('./config/db');
const app = require('./app');

console.log('Starting backend server...');

// Check environment
console.log('Environment check:');
console.log('PORT:', PORT);

// Connect to database FIRST, then start server
async function startServer() {
    try {
        await connectDB();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log('Server started on port', PORT);
            console.log('API available at: http://localhost:' + PORT);
        });

    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();
