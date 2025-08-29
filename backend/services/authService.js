// services/authService.js
// Business logic for authentication - login and registration
// This layer separates DB operations from route handling for better maintainability

const User = require('../models/User');
const { USER_FIELDS, MSG } = require('../config/constants');

// =====================
// VALIDATION FUNCTIONS
// =====================
// Simple validation functions (same as your original code)
const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const validatePassword = (password) => password && password.length >= 6;
const validateUsername = (username) => username && username.length >= 3;

// =====================
// PASSWORD ENCODING
// =====================
// Simple base64 encoding (same as your current system - no advanced encryption)
// This matches exactly what you were doing with MySQL
function encodeBase64(plain) {
    return Buffer.from(String(plain), 'utf8').toString('base64');
}

// Simple comparison function
function safeCompare(a, b) {
    return a === b;
}

// =====================
// LOGIN FUNCTION
// =====================
async function login({ username, password }) {
    console.log(`👤 Login attempt for: ${username}`);

    // Check if both username and password provided
    if (!username || !password) {
        return {
            status: 400,
            body: { success: false, message: MSG.ALL_FIELDS_REQUIRED }
        };
    }

    try {
        // Find user in database (include password for comparison)
        // Using .lean() for better performance - returns plain JS object
        const user = await User.findOne({ [USER_FIELDS.USERNAME]: username })
            .select(`${USER_FIELDS.ID} ${USER_FIELDS.USERNAME} ${USER_FIELDS.EMAIL} ${USER_FIELDS.PASSWORD}`)
            .lean();

        // Check if user exists
        if (!user) {
            console.log('❌ Invalid credentials');
            return {
                status: 401,
                body: { success: false, message: MSG.INVALID_CREDENTIALS }
            };
        }

        // Compare passwords using the same base64 encoding as before
        const encodedPassword = encodeBase64(password);
        if (!safeCompare(encodedPassword, user[USER_FIELDS.PASSWORD])) {
            console.log('❌ Invalid credentials');
            return {
                status: 401,
                body: { success: false, message: MSG.INVALID_CREDENTIALS }
            };
        }

        // Login successful - remove password from response for security
        const { [USER_FIELDS.PASSWORD]: _, ...publicUser } = user;
        console.log(`✅ Login successful: ${user[USER_FIELDS.USERNAME]}`);

        return {
            status: 200,
            body: { success: true, message: MSG.LOGIN_SUCCESS, user: publicUser }
        };

    } catch (error) {
        console.error('❌ Login error:', error.message);
        return {
            status: 500,
            body: { success: false, message: MSG.SERVER_ERROR }
        };
    }
}

// =====================
// REGISTER FUNCTION
// =====================
async function register({ username, email, password }) {
    console.log(`👤 Registration for: ${username}`);

    // =====================
    // INPUT VALIDATION
    // =====================

    // Check if all required fields are provided
    if (!username || !email || !password) {
        return {
            status: 400,
            body: { success: false, message: MSG.ALL_FIELDS_REQUIRED }
        };
    }

    // Validate username length (minimum 3 characters)
    if (!validateUsername(username)) {
        return {
            status: 400,
            body: { success: false, message: MSG.USERNAME_SHORT }
        };
    }

    // Validate password length (minimum 6 characters)
    if (!validatePassword(password)) {
        return {
            status: 400,
            body: { success: false, message: MSG.PASSWORD_SHORT }
        };
    }

    // Validate email format using regex
    if (!validateEmail(email)) {
        return {
            status: 400,
            body: { success: false, message: MSG.EMAIL_INVALID }
        };
    }

    // =====================
    // DATABASE OPERATIONS
    // =====================

    try {
        // Create new user with base64 encoded password
        // This maintains compatibility with your existing password encoding
        const doc = await User.create({
            [USER_FIELDS.USERNAME]: username,
            [USER_FIELDS.EMAIL]: email,
            [USER_FIELDS.PASSWORD]: encodeBase64(password),
        });

        // Prepare user response (without password for security)
        const user = {
            [USER_FIELDS.ID]: doc.id,
            [USER_FIELDS.USERNAME]: doc[USER_FIELDS.USERNAME],
            [USER_FIELDS.EMAIL]: doc[USER_FIELDS.EMAIL],
        };

        console.log(`✅ User registered with ID: ${doc.id}`);

        return {
            status: 201,
            body: { success: true, message: MSG.REGISTER_SUCCESS, user }
        };

    } catch (error) {
        console.error('❌ Database error:', error.message);

        // Handle MongoDB duplicate key error (code 11000)
        // This occurs when username or email already exists
        if (error && error.code === 11000) {
            return {
                status: 409,
                body: { success: false, message: MSG.DUPLICATE_USER }
            };
        }

        // Handle any other database errors
        return {
            status: 500,
            body: { success: false, message: MSG.SERVER_ERROR }
        };
    }
}

// Export functions for use in routes
module.exports = { login, register };
