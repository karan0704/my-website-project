// Simple validation functions that check if user input is correct
import { VALIDATION_RULES } from './constants';

// Check if email looks correct (has @ and .)
export const isValidEmail = (email) => {
    if (!email) return false;
    return email.includes('@') && email.includes('.');
};

// Check if password is long enough
export const isValidPassword = (password) => {
    if (!password) return false;
    return password.length >= VALIDATION_RULES.MIN_PASSWORD_LENGTH;
};

// Check if username is long enough
export const isValidUsername = (username) => {
    if (!username) return false;
    return username.length >= VALIDATION_RULES.MIN_USERNAME_LENGTH;
};

// Check if a field is not empty
export const isRequired = (value) => {
    return value && value.trim().length > 0;
};

// Validate entire login form
export const validateLoginForm = (username, password) => {
    const errors = {};

    if (!isRequired(username)) {
        errors.username = 'Username is required';
    } else if (!isValidUsername(username)) {
        errors.username = 'Username must be at least 3 characters';
    }

    if (!isRequired(password)) {
        errors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
        errors.password = 'Password must be at least 6 characters';
    }

    return errors;
};

// Validate entire registration form
export const validateRegisterForm = (username, email, password) => {
    const errors = {};

    if (!isRequired(username)) {
        errors.username = 'Username is required';
    } else if (!isValidUsername(username)) {
        errors.username = 'Username must be at least 3 characters';
    }

    if (!isRequired(email)) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email';
    }

    if (!isRequired(password)) {
        errors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
        errors.password = 'Password must be at least 6 characters';
    }

    return errors;
};
