// app.js -Express

const express = require('express');
const cors = require('cors');

// Load environment configuration
const { FRONTEND_URL } = require('./config/env');

// Import routes and middleware
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

console.log('Starting Express application...');

// Create Express application
const app = express();

// Setup middleware (functions that run for every request)
app.use(cors({ origin: FRONTEND_URL })); // Allow React app to call our API
app.use(express.json());                 // Parse JSON from request body

console.log('Middleware setup complete');

// Setup routes
app.use('/api/auth', authRoutes); // All auth routes start with /api/auth

// Basic test route
app.get('/', function(req, res) {
    res.json({ message: 'Backend server is running!' });
});

// Health check route
app.get('/health', function(req, res) {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Error handler must be LAST middleware
app.use(errorHandler);

// Export app for server.js to use
module.exports = app;
