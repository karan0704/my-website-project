// middleware/errorHandler.js
// Handles errors that happen in the application

const { formatResponse, getCurrentTimestamp } = require('../utils/helpers');

// Error handler function
// This gets called when an error happens in Express
// Parameters: err (the error), req (request), res (response), next (not used)
function errorHandler(err, req, res, next) {
    // Log error details for debugging
    console.error('Error occurred at', getCurrentTimestamp());
    console.error('Route:', req.method, req.path);
    console.error('Error message:', err.message);

    // Default error response
    let statusCode = 500; // Server error
    let errorMessage = 'Server error occurred';

    // Check what kind of error and customize response
    if (err.name === 'ValidationError') {
        // MongoDB validation error
        statusCode = 400;
        errorMessage = 'Invalid data provided';
    } else if (err.name === 'CastError') {
        // MongoDB ID format error
        statusCode = 400;
        errorMessage = 'Invalid data format';
    } else if (err.code === 11000) {
        // MongoDB duplicate key error
        statusCode = 409;
        errorMessage = 'Data already exists';
    }

    // Send error response to client
    res.status(statusCode).json(formatResponse(false, errorMessage));
}

module.exports = errorHandler;
