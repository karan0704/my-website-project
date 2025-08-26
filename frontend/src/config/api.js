// ============================================================================
// API CONFIGURATION MODULE - Centralized API Settings
// ============================================================================
// 🎯 This file reads from .env and creates all API endpoints dynamically
// You NEVER need to change this file - just update .env

// READ API BASE URL FROM ENVIRONMENT
// ==================================
// This automatically reads REACT_APP_API_BASE_URL from your .env file
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log("🔧 Loading API configuration...");
console.log(`📡 API Base URL: ${API_BASE_URL}`);

// ENVIRONMENT VALIDATION
// ======================
// Check if API URL is properly configured
if (!API_BASE_URL) {
    console.error("❌ REACT_APP_API_BASE_URL is missing from .env file!");
    throw new Error(
        '🚨 API Configuration Error: REACT_APP_API_BASE_URL not found in environment variables.\n' +
        '💡 Solution: Add REACT_APP_API_BASE_URL=http://localhost:5010/api to your .env file'
    );
}

// Validate API URL format
if (!API_BASE_URL.startsWith('http')) {
    console.error("❌ Invalid API URL format!");
    throw new Error(
        `🚨 API URL must start with http:// or https://\n` +
        `Current value: ${API_BASE_URL}\n` +
        `💡 Example: http://localhost:5010/api`
    );
}

// DYNAMIC API ENDPOINTS GENERATION
// =================================
// 🎯 These endpoints are automatically generated from your API_BASE_URL
// When you change the port in .env, ALL these endpoints update automatically
const API_ENDPOINTS = {
    // AUTHENTICATION ENDPOINTS
    // ========================
    // Generated URLs: http://localhost:5010/api/auth/login, etc.
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,        // POST - User login
        REGISTER: `${API_BASE_URL}/auth/register`,  // POST - User registration
        LOGOUT: `${API_BASE_URL}/auth/logout`,      // POST - User logout (future)
        PROFILE: `${API_BASE_URL}/auth/profile`,    // GET - User profile (future)
    },

    // USER MANAGEMENT ENDPOINTS (for future features)
    // ===============================================
    USER: {
        LIST: `${API_BASE_URL}/users`,                    // GET - List all users
        DETAIL: (id) => `${API_BASE_URL}/users/${id}`,    // GET - User details
        UPDATE: (id) => `${API_BASE_URL}/users/${id}`,    // PUT - Update user
        DELETE: (id) => `${API_BASE_URL}/users/${id}`,    // DELETE - Delete user
    },

    // TODO ENDPOINTS (for future features)
    // ====================================
    TODOS: {
        LIST: `${API_BASE_URL}/todos`,                    // GET - List todos
        CREATE: `${API_BASE_URL}/todos`,                  // POST - Create todo
        UPDATE: (id) => `${API_BASE_URL}/todos/${id}`,    // PUT - Update todo
        DELETE: (id) => `${API_BASE_URL}/todos/${id}`,    // DELETE - Delete todo
    },

    // HEALTH CHECK ENDPOINTS
    // ======================
    HEALTH: {
        STATUS: `${API_BASE_URL.replace('/api', '')}/`,       // GET - Server status
        HEALTH: `${API_BASE_URL.replace('/api', '')}/health`, // GET - Health check
    }
};

// APPLICATION CONFIGURATION
// ==========================
// All app settings in one place
export const APP_CONFIG = {
    // API SETTINGS
    API_BASE_URL,                                           // Full API base URL
    API_ENDPOINTS,                                          // All generated endpoints

    // APP METADATA
    APP_NAME: process.env.REACT_APP_APP_NAME || 'React App',     // App name from .env
    VERSION: process.env.REACT_APP_VERSION || '1.0.0',          // Version from .env

    // ENVIRONMENT INFO
    ENVIRONMENT: process.env.NODE_ENV || 'development',          // Current environment
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',      // Development flag
    IS_PRODUCTION: process.env.NODE_ENV === 'production',        // Production flag

    // DEBUG SETTINGS
    SHOW_DEBUG: process.env.REACT_APP_SHOW_DEBUG === 'true',     // Show debug info
};

// DEVELOPMENT LOGGING
// ===================
// Show configuration in browser console during development
if (APP_CONFIG.IS_DEVELOPMENT) {
    console.log("=".repeat(60));
    console.log("🔧 API CONFIGURATION LOADED");
    console.log("=".repeat(60));
    console.log(`📡 API Base URL: ${API_CONFIG.API_BASE_URL}`);
    console.log(`🎯 App Name: ${APP_CONFIG.APP_NAME}`);
    console.log(`📦 Version: ${APP_CONFIG.VERSION}`);
    console.log(`🌍 Environment: ${APP_CONFIG.ENVIRONMENT}`);
    console.log("📋 Available Endpoints:");
    console.log(`   Login: ${API_ENDPOINTS.AUTH.LOGIN}`);
    console.log(`   Register: ${API_ENDPOINTS.AUTH.REGISTER}`);
    console.log("=".repeat(60));
}

// EXPORT FOR USE IN OTHER FILES
// ==============================
export default APP_CONFIG;

// Named exports for convenience
export { API_ENDPOINTS };
