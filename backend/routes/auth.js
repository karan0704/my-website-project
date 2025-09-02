// routes/auth.js
// HTTP routes for login and register

const express = require('express');
const router = express.Router();

// Import login and register functions from service
const {login, register, updateProfile, deleteProfile} = require('../services/authService');
const {logRequest} = require('../utils/helpers');

// LOGIN ROUTE - handles POST requests to /api/auth/login
// When someone sends POST request to this URL, this function runs
router.post('/login', function (req, res) {
    // Log this request for debugging
    // logRequest('POST', '/api/auth/login');

    console.log('Login request received');

    // Get username and password from request body
    // req.body contains the JSON data sent by the client
    const credentials = {
        username: req.body.username,
        password: req.body.password
    };

    // Call login function (which returns a Promise)
    login(credentials)
        .then(function (result) {
            // Login function completed successfully
            // result contains status (number) and body (object)

            // Send response back to client
            // res.status(number) sets HTTP status code (200=success, 400=error)
            // res.json(object) sends the object as JSON response
            res.status(result.status).json(result.body);
        })
        .catch(function (err) {
            // Login function had an error
            console.error('Server error:', err.message);

            // Send error response to client
            res.status(500).json({
                success: false,
                message: 'Server error occurred'
            });
        });
});

// REGISTER ROUTE - handles POST requests to /api/auth/register
router.post('/register', function (req, res) {
    //logRequest('POST', '/api/auth/register');

    console.log('Registration request received');

    // Get user data from request body
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    // Call register function
    register(userData)
        .then(function (result) {
            // Registration completed
            res.status(result.status).json(result.body);
        })
        .catch(function (err) {
            // Registration had an error
            console.error('Server error:', err.message);
            res.status(500).json({
                success: false,
                message: 'Server error occurred'
            });
        });
});

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
                success: false,
                message: 'Server error occurred'
            });
        });
});

// DELETE PROFILE ROUTE - handles DELETE requests to /api/auth/profile
router.delete('/profile', function (req, res) {
    console.log('Profile deletion request received');

    const deleteData = {
        userId: req.body.userId,
        currentPassword: req.body.currentPassword
    };

    deleteProfile(deleteData).then(function (result) {
        res.status(result.status).json(result.body);
    })
        .catch(function (err) {
            console.error('Server error:', err.message);
            res.status(500).json({
                success: false,
                message: 'Server error occurred'
            });
        });
});

// Export router so app.js can use these routes
module.exports = router;
