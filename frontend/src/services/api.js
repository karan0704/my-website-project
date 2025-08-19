// ============================================================================
// API SERVICE - Centralized API communication functions
// ============================================================================
// This file handles all HTTP requests to the backend server

// API BASE URL - Backend server location
const API_BASE_URL = 'http://localhost:5000/api';

// LOGIN API FUNCTION
// ==================
// Sends login request to backend server
export const loginUser = async (username, password) => {
    console.log(`🌐 Making login API call for user: ${username}`);

    try {
        // Make HTTP POST request to login endpoint
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',                           // HTTP method for sending data
            headers: {
                'Content-Type': 'application/json',    // Tell server we're sending JSON
            },
            body: JSON.stringify({ username, password })  // Convert data to JSON string
        });

        // Parse JSON response from server
        const data = await response.json();
        console.log(`📥 Login response received:`, data);

        // Check if request was successful (status 200-299)
        if (!response.ok) {
            // If not successful, throw error with server message
            throw new Error(data.message || 'Login failed');
        }

        // Return user data on success
        return data;

    } catch (error) {
        console.error('❌ Login API error:', error);
        // Re-throw error to be handled by calling component
        throw error;
    }
};

// REGISTER API FUNCTION
// ======================
// Sends registration request to backend server
export const registerUser = async (username, email, password) => {
    console.log(`🌐 Making registration API call for user: ${username}`);

    try {
        // Make HTTP POST request to register endpoint
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        // Parse JSON response from server
        const data = await response.json();
        console.log(`📥 Registration response received:`, data);

        // Check if request was successful
        if (!response.ok) {
            // If not successful, throw error with server message
            throw new Error(data.message || 'Registration failed');
        }

        // Return registration data on success
        return data;

    } catch (error) {
        console.error('❌ Registration API error:', error);
        // Re-throw error to be handled by calling component
        throw error;
    }
};
