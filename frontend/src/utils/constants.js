// Application constants - all the fixed values used across the app
export const API_CONFIG = {
    BASE_URL: 'http://localhost:5010/api',
    ENDPOINTS: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
        DELETE_PROFILE: '/auth/profile'
    }
};

// Validation rules
export const VALIDATION_RULES = {
    MIN_USERNAME_LENGTH: 3,
    MIN_PASSWORD_LENGTH: 6
};

// User messages
export const MESSAGES = {
    // Success messages
    LOGIN_SUCCESS: 'Login successful!',
    REGISTER_SUCCESS: 'Account created! Please login now.',
    PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!',
    PROFILE_DELETE_SUCCESS: 'Profile deleted successfully!',

    // Error messages
    NETWORK_ERROR: 'Cannot connect to server',
    INVALID_INPUT: 'Please check your input',
    REQUIRED_FIELDS: 'All fields are required',

    // Loading messages
    LOADING_LOGIN: 'Logging in...',
    LOADING_REGISTER: 'Creating account...',
    LOADING_UPDATE: 'Updating...',
    LOADING_DELETE: 'Deleting...'
};
