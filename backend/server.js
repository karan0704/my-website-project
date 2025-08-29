// server.js

// Load centralized environment and database configuration
require('dotenv').config();

const {PORT} = require('./config/env');
const {connectDB} = require('./config/db');
const app = require('./app');

console.log('🚀 Starting backend server...');

// Check environment
console.log('🔍 Environment check:');
console.log('PORT:', PORT);

// Connect to database FIRST
connectDB()
    .then(() => {

        // Database connected successfully, now start server
        console.log('✅ Database connected successfully');

        // Start the server
        app.listen(PORT, () => {
            console.log('='.repeat(40));
            console.log(`🎉 Server started on port ${PORT}`);
            console.log(`🌐 API available at: http://localhost:${PORT}`);
            console.log('='.repeat(40));
        });
    }).catch((err) => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
});