// utils/helpers.js
// Simple helper functions

// Function to create response format
// Parameters: success (true/false), message (string), data (optional object)
function formatResponse(success, message, data) {
    const response = {
        success: success,
        message: message
    };

    // Only add data if something was provided
    if (data !== undefined) {
        response.data = data;
    }

    return response;
}

// Function to get current time
function getCurrentTimestamp() {
    return new Date().toISOString();
}

// Function to log requests
// Parameters: method (GET/POST), endpoint (URL path), user (username or 'anonymous')
function logRequest(method, endpoint, user) {
    // If no user provided, use 'anonymous'
    if (!user) {
        user = 'anonymous';
    }

    const timestamp = getCurrentTimestamp();
    console.log('[' + timestamp + '] ' + method + ' ' + endpoint + ' - User: ' + user);
}

// Export functions
module.exports = {
    formatResponse: formatResponse,
    getCurrentTimestamp: getCurrentTimestamp,
    logRequest: logRequest
};
