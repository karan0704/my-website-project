// app.js - Express application setup and configuration

const express = require('express'); // Web framework
const cors = require('cors');       // Allow frontend to call backend

// Load centralized environment configuration
const { FRONTEND_URL } = require('./config/env');

// Import routes
const authRoutes = require('./routes/auth');

console.log('🚀 Starting Express application...');

// CREATE SERVER
// =============
const app = express();

// MIDDLEWARE SETUP
// ================
// Tell Express how to handle requests
app.use(cors({ origin: FRONTEND_URL })); // Allow React to call API
app.use(express.json());                 // Read JSON from requests

console.log('✅ Middleware setup complete');

// ROUTES
// ======
app.use('/api/auth', authRoutes); // All auth routes will be prefixed with /api/auth

// BASIC ROUTES
// ============
// Test if server running
app.get('/', (req, res) => {
    res.json({ message: 'Backend server running!' });
});

// Export app for use in server.js
module.exports = app;
