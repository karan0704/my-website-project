// API service functions - these talk to the backend server
import { API_CONFIG } from '../utils/constants';

// Helper function to make API calls easier
const makeApiCall = async (endpoint, method, data) => {
    try {
        const response = await fetch(API_CONFIG.BASE_URL + endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API call failed:', error);
        throw new Error('Network error - please try again');
    }
};

// Login user
export const loginUser = async (username, password) => {
    return makeApiCall(API_CONFIG.ENDPOINTS.LOGIN, 'POST', {
        username,
        password
    });
};

// Register new user
export const registerUser = async (username, email, password) => {
    return makeApiCall(API_CONFIG.ENDPOINTS.REGISTER, 'POST', {
        username,
        email,
        password
    });
};

// Update user profile
export const updateUserProfile = async (userId, currentPassword, newUsername, newPassword) => {
    const updateData = {
        userId,
        currentPassword
    };

    // Only add fields that are being updated
    if (newUsername) updateData.newUsername = newUsername;
    if (newPassword) updateData.newPassword = newPassword;

    return makeApiCall(API_CONFIG.ENDPOINTS.PROFILE, 'PUT', updateData);
};

// Delete user profile
export const deleteUserProfile = async (userId, currentPassword) => {
    return makeApiCall(API_CONFIG.ENDPOINTS.DELETE_PROFILE, 'DELETE', {
        userId,
        currentPassword
    });
};