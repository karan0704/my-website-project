// config/constants.js
// Single source of truth for all string constants used across the app

module.exports = {
    // Database collections
    COLLECTIONS: {
        USERS: 'users',
    },

    // User model field names
    USER_FIELDS: {
        ID: '_id',
        USERNAME: 'username',
        EMAIL: 'email',
        PASSWORD: 'password',
        ROLE: 'role',
        CREATED_AT: 'createdAt',
        UPDATED_AT: 'updatedAt',
    },

    // User roles
    ROLES: {
        USER: 'user',
        ADMIN: 'admin',
    },

    // Response messages
    MSG: {
        SERVER_ERROR: 'Server error',
        INVALID_CREDENTIALS: 'Invalid username or password',
        LOGIN_SUCCESS: 'Login successful',
        REGISTER_SUCCESS: 'Registration successful',
        ALL_FIELDS_REQUIRED: 'All fields required',
        USERNAME_SHORT: 'Username too short',
        PASSWORD_SHORT: 'Password too short',
        EMAIL_INVALID: 'Invalid email format',
        DUPLICATE_USER: 'Username or email already exists',
    },
};
