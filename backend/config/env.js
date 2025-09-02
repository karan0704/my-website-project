// config/env.js

// load .env file
require('dotenv').config();

// List - env var
const required = ['MONGO_URI', 'PORT', 'FRONTEND_URL'];

// Check if req var are missing
let missing = [];
for (let i = 0; i < required.length; i++) {
    const varName = required[i];
    if (!process.env[varName]) {
        missing.push(varName);
    }
}

// stop server if env var is missing
if (missing.length > 0) {
    console.error('❌ Missing variables in .env file:', missing);
    console.log('💡 Please add these variables to your .env file');
    process.exit(1); // Stop the server completely
}

console.log('✅ All environment variables found');

// Export env var
module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
    FRONTEND_URL: process.env.FRONTEND_URL,
    MONGO_URI: process.env.MONGO_URI,
};
