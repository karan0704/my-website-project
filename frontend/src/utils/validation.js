// ============================================================================
// VALIDATION UTILITIES - Centralized validation functions
// ============================================================================
// These functions validate user input and return error messages if invalid

// USERNAME VALIDATION
// ===================
// Validates username according to our rules
export const validateUsername = (username) => {
    // Check if username is provided
    if (!username) return "Username is required";

    // Check minimum length
    if (username.length < 3) return "Username must be at least 3 characters";

    // Check allowed characters (letters, numbers, underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return "Username can only contain letters, numbers, and underscores";
    }

    // If all checks pass, return null (no error)
    return null;
};

// EMAIL VALIDATION
// ================
// Validates email format using regular expression
export const validateEmail = (email) => {
    // Check if email is provided
    if (!email) return "Email is required";

    // Regular expression for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test email against regex pattern
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
    }

    // If email format is valid, return null (no error)
    return null;
};

// PASSWORD VALIDATION
// ===================
// Validates password strength
export const validatePassword = (password) => {
    // Check if password is provided
    if (!password) return "Password is required";

    // Check minimum length
    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }

    // Additional password rules can be added here:
    // - Must contain uppercase letter
    // - Must contain special character
    // - Must contain number

    // If all checks pass, return null (no error)
    return null;
};
