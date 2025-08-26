// ============================================================================
// API SERVICE - Simple HTTP Requests to Backend
// ============================================================================
// 🎯 This file handles talking to your backend server
// It reads the backend URL from .env so you only change it in one place

// IMPORT CONFIGURATION
// ====================
// Get the API settings from our config file
import { APP_CONFIG, API_ENDPOINTS } from '../config/api';

console.log("🌐 Setting up API service...");
console.log(`📡 Backend URL: ${APP_CONFIG.API_BASE_URL}`);

// ============================================================================
// SIMPLE HTTP REQUEST FUNCTION
// ============================================================================
// 🎯 This function sends requests to your backend server
// Instead of writing fetch() code everywhere, we write it once here

const callBackend = async (url, method = 'GET', data = null) => {
    console.log(`📤 Sending ${method} request to: ${url}`);

    try {
        // STEP 1: PREPARE THE REQUEST
        // ===========================
        // Set up what we're sending to the backend

        // Basic request setup
        const requestSettings = {
            method: method,  // GET, POST, PUT, DELETE
        };

        // Add headers (think of these as "envelope labels" for your request)
        requestSettings.headers = {};
        requestSettings.headers['Content-Type'] = 'application/json';  // Tell server we're sending JSON
        requestSettings.headers['Accept'] = 'application/json';        // Tell server we want JSON back

        // If we have data to send (for POST, PUT requests)
        if (data) {
            // Convert JavaScript object to JSON string
            requestSettings.body = JSON.stringify(data);
            console.log(`📦 Sending data:`, data);
        }

        console.log(`⚙️ Request settings:`, {
            method: requestSettings.method,
            url: url,
            hasData: !!data
        });

        // STEP 2: SEND THE REQUEST
        // ========================
        // Actually send the HTTP request to backend
        console.log(`🚀 Sending request...`);
        const response = await fetch(url, requestSettings);

        console.log(`📥 Got response with status: ${response.status}`);

        // STEP 3: READ THE RESPONSE
        // =========================
        // Get the JSON data from backend's response
        let responseData;
        try {
            responseData = await response.json();
            console.log(`✅ Response data received:`, responseData);
        } catch (error) {
            console.error("❌ Could not read response as JSON:", error);
            throw new Error('Backend sent invalid response format');
        }

        // STEP 4: CHECK IF REQUEST WAS SUCCESSFUL
        // =======================================
        // HTTP status codes: 200-299 = success, 400+ = error
        if (response.status >= 200 && response.status < 300) {
            // SUCCESS!
            console.log(`🎉 Request successful!`);
            return responseData;
        } else {
            // ERROR!
            console.error(`❌ Backend returned error (${response.status}):`, responseData.message);
            throw new Error(responseData.message || `Server error: ${response.status}`);
        }

    } catch (error) {
        // HANDLE NETWORK ERRORS
        // =====================
        console.error(`💥 Request failed:`, error.message);

        // Check if it's a network error (backend not running)
        if (error.message.includes('fetch')) {
            throw new Error(
                `🌐 Cannot connect to backend server!\n` +
                `Make sure your backend is running on the correct port.\n` +
                `Trying to connect to: ${url}`
            );
        }

        // Re-throw the original error
        throw error;
    }
};

// ============================================================================
// LOGIN FUNCTION - Simple Version
// ============================================================================
// 🎯 Send username and password to backend for login

export const loginUser = async (username, password) => {
    console.log(`🔑 Starting login process for user: ${username}`);

    // The login URL comes from our config (automatically includes correct port)
    const loginUrl = API_ENDPOINTS.AUTH.LOGIN;
    console.log(`📍 Login URL: ${loginUrl}`);

    // Data to send to backend
    const loginData = {
        username: username,
        password: password
    };

    console.log(`📤 Sending login request...`);

    try {
        // Use our simple HTTP function
        // callBackend(url, method, data)
        const result = await callBackend(loginUrl, 'POST', loginData);

        console.log(`✅ Login successful for user: ${username}`);
        return result;  // Contains user info from backend

    } catch (error) {
        console.error(`❌ Login failed for user: ${username}`, error.message);
        throw error;  // Pass error back to the component
    }
};

// ============================================================================
// REGISTER FUNCTION - Simple Version
// ============================================================================
// 🎯 Send user details to backend to create new account

export const registerUser = async (username, email, password) => {
    console.log(`📝 Starting registration for user: ${username}`);

    // The register URL comes from our config (automatically includes correct port)
    const registerUrl = API_ENDPOINTS.AUTH.REGISTER;
    console.log(`📍 Register URL: ${registerUrl}`);

    // Data to send to backend
    const registerData = {
        username: username,
        email: email,
        password: password
    };

    console.log(`📤 Sending registration request...`);

    try {
        // Use our simple HTTP function
        const result = await callBackend(registerUrl, 'POST', registerData);

        console.log(`✅ Registration successful for user: ${username}`);
        return result;  // Contains success message from backend

    } catch (error) {
        console.error(`❌ Registration failed for user: ${username}`, error.message);
        throw error;  // Pass error back to the component
    }
};

// ============================================================================
// HEALTH CHECK FUNCTION - Simple Version
// ============================================================================
// 🎯 Test if backend server is running and responding

export const checkBackendHealth = async () => {
    console.log(`🏥 Checking if backend is healthy...`);

    // Get the backend base URL (without /api)
    const backendBaseUrl = APP_CONFIG.API_BASE_URL.replace('/api', '');
    const healthUrl = `${backendBaseUrl}/`;

    console.log(`📍 Health check URL: ${healthUrl}`);

    try {
        // Simple GET request to backend root
        const result = await callBackend(healthUrl, 'GET');

        console.log(`✅ Backend is healthy:`, result.message);
        return true;

    } catch (error) {
        console.error(`❌ Backend health check failed:`, error.message);
        return false;
    }
};

// ============================================================================
// SIMPLE CONNECTION TEST
// ============================================================================
// 🎯 Easy way to test if backend is reachable

export const testConnection = async () => {
    console.log(`🧪 Testing connection to backend...`);

    try {
        const isHealthy = await checkBackendHealth();

        if (isHealthy) {
            console.log(`✅ Connection test passed - backend is reachable`);
            return true;
        } else {
            console.log(`❌ Connection test failed - backend not responding`);
            return false;
        }
    } catch (error) {
        console.error(`💥 Connection test error:`, error.message);
        return false;
    }
};

// ============================================================================
// EXPORT CONFIGURATION FOR DEBUGGING
// ============================================================================
// 🎯 Let components see the current API configuration

export { APP_CONFIG, API_ENDPOINTS };

// ============================================================================
// STARTUP LOGGING
// ============================================================================
// Show what's happening when this file loads

if (APP_CONFIG.IS_DEVELOPMENT) {
    console.log("=".repeat(50));
    console.log("🔧 API SERVICE LOADED");
    console.log("=".repeat(50));
    console.log(`📡 Backend URL: ${APP_CONFIG.API_BASE_URL}`);
    console.log(`🔑 Login endpoint: ${API_ENDPOINTS.AUTH.LOGIN}`);
    console.log(`📝 Register endpoint: ${API_ENDPOINTS.AUTH.REGISTER}`);
    console.log(`🎯 All API calls will go to this backend`);
    console.log("=".repeat(50));
}

// ============================================================================
// WHAT THIS FILE DOES - SIMPLE EXPLANATION
// ============================================================================
/*
🎯 PURPOSE: This file helps your React app talk to your backend server

📋 WHAT IT PROVIDES:
1. loginUser(username, password) - Log user in
2. registerUser(username, email, password) - Create new user account
3. checkBackendHealth() - Test if backend is running
4. testConnection() - Simple connection test

🔧 HOW IT WORKS:
1. Reads backend URL from your .env file (REACT_APP_API_BASE_URL)
2. Builds complete URLs automatically (login, register, etc.)
3. Sends HTTP requests to backend using fetch()
4. Handles errors and returns results to your components

💡 TO CHANGE BACKEND PORT:
Just update REACT_APP_API_BASE_URL in your .env file
Everything else updates automatically!

Example .env:
PORT=3010
REACT_APP_API_BASE_URL=http://localhost:5010/api

🎓 FOR BEGINNERS:
- HTTP = how frontend talks to backend over internet
- JSON = data format (like a letter with structured info)
- fetch() = JavaScript function to send HTTP requests
- async/await = way to handle requests that take time
- try/catch = way to handle errors gracefully
*/
