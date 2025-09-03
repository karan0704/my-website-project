// routes/auth.js
// HTTP routes for login and register

const express = require('express');
const router = express.Router();

// Import login and register functions from service
const {login, register, updateProfile, deleteProfile} = require('../services/authService');
const {logRequest} = require('../utils/helpers');

// LOGIN ROUTE - handles POST requests to /api/auth/login
router.post('/login', async (req, res) => {

    try {
        console.log('Login request received');

        const credentials = {
            username: req.body.username,
            password: req.body.password
        };

        const result = await login(credentials); // result contains status (number) and body (object)

        res.status(result.status).json(result.body); // Response back to client - status code (200=success, 400=error), JSON response
    } catch (err) {
        console.error('Server error:', err.message);

        res.status(500).json({
            success: false, message: 'Server error occurred'
        });
    }
});

// REGISTER ROUTE - /api/auth/register
router.post('/register', async function (req, res) {

        try {
            console.log('Registration request received');

            const userData = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };

            const result = await register(userData);    // Call register function

            res.status(result.status).json(result.body);
        } catch (err) {
            console.error('Server error:', err.message);

            res.status(500)
                .json({
                    success: false, message: 'Server error occurred'
                });
        }
    }
);


// UPDATE PROFILE ROUTE - handles PUT requests to /api/auth/profile
router.put('/profile', function (req, res) {
    console.log('Profile update request received');

    // Get user data from request body
    const updateData = {
        userId: req.body.userId,
        currentPassword: req.body.currentPassword,
        newUsername: req.body.newUsername,
        newPassword: req.body.newPassword
    };

    // Call updateProfile function
    updateProfile(updateData)
        .then(function (result) {
            res.status(result.status).json(result.body);
        })
        .catch(function (err) {
            console.error('Server error:', err.message);
            res.status(500).json({
                success: false, message: 'Server error occurred'
            });
        });
});

// DELETE PROFILE ROUTE - handles DELETE requests to /api/auth/profile
router.delete('/profile', function (req, res) {
    console.log('Profile deletion request received');

    const deleteData = {
        userId: req.body.userId, currentPassword: req.body.currentPassword
    };

    deleteProfile(deleteData).then(function (result) {
        res.status(result.status).json(result.body);
    })
        .catch(function (err) {
            console.error('Server error:', err.message);
            res.status(500).json({
                success: false, message: 'Server error occurred'
            });
        });
});

// Export router so app.js can use these routes
module.exports = router;
