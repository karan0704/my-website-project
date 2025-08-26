// routes/auth.js - All authentication related routes (MongoDB version)

const express = require('express');
const router = express.Router();

// Import business logic from service layer
const { login, register } = require('../services/authService');

// LOGIN ROUTE - POST /login
// =========================
router.post('/login', async (req, res) => {
    console.log('🔑 Login request received');

    try {
        // Call login service with username and password
        const result = await login({
            username: req.body?.username,
            password: req.body?.password,
        });

        // Return response from service
        return res.status(result.status).json(result.body);

    } catch (err) {
        console.error('❌ Server error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// REGISTER ROUTE - POST /register
// ===============================
router.post('/register', async (req, res) => {
    console.log('📝 Registration request received');

    try {
        // Call register service with user data
        const result = await register({
            username: req.body?.username,
            email: req.body?.email,
            password: req.body?.password,
        });

        // Return response from service
        return res.status(result.status).json(result.body);

    } catch (err) {
        console.error('❌ Server error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
