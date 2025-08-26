// config/env.js
// Centralized environment variable loading and validation

const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

// List of required environment variables
const required = ['MONGO_URI', 'PORT', 'FRONTEND_URL'];

// Check if any required variables are missing
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
    console.error('❌ Missing variables in .env:', missing);
    process.exit(1);
}

console.log('✅ Environment variables found');

// Export all environment variables
module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
    FRONTEND_URL: process.env.FRONTEND_URL,
    MONGO_URI: process.env.MONGO_URI,
};
