// services/authService.js
// Authentication logic - simple version with promises

const User = require('../models/User');
// This line imports field names and messages from constants file
// USER_FIELDS = object with database field names like 'username', 'email'
// MSG = object with messages like 'Login successful', 'Invalid credentials'
const {USER_FIELDS, MSG} = require('../config/constants');
const {formatResponse} = require('../utils/helpers');

// Simple validation functions
function validateEmail(email) {
    // Check if email has @ and . symbols
    return email && email.includes('@') && email.includes('.');
}

function validatePassword(password) {
    // Check if password exists and is at least 6 characters
    return password && password.length >= 6;
}

function validateUsername(username) {
    // Check if username exists and is at least 3 characters
    return username && username.length >= 3;
}

// Simple password encoding (NOT SECURE - for learning only)
function encodePassword(plainPassword) {
    // Convert password to base64 encoding
    return Buffer.from(String(plainPassword), 'utf8').toString('base64');
}

// Simple password comparison
function comparePasswords(password1, password2) {
    // Check if both passwords are exactly the same
    return password1 === password2;
}

// Login function using promises (not async/await)
// Parameter: credentials object with username and password
function login(credentials) {
    console.log('Login attempt for:', credentials.username);

    // Create and return a Promise
    // Promise takes a function with resolve and reject parameters
    return new Promise(function (resolve, reject) {

        // Get username and password from credentials object
        const username = credentials.username;
        const password = credentials.password;

        // Check if both username and password were provided
        if (!username || !password) {
            // If missing, resolve with error response
            resolve({
                status: 400,
                body: formatResponse(false, MSG.ALL_FIELDS_REQUIRED)
            });
            return; // Stop execution here
        }

        // Find user in database
        // This returns a Promise, so we use .then() instead of await
        User.findOne({[USER_FIELDS.USERNAME]: username})
            .select(USER_FIELDS.ID + ' ' + USER_FIELDS.USERNAME + ' ' + USER_FIELDS.EMAIL + ' ' + USER_FIELDS.PASSWORD)
            .lean() // Returns plain JavaScript object
            .then(function (user) {
                // This function runs when database search completes successfully

                // Check if user was found
                if (!user) {
                    console.log('User not found');
                    resolve({
                        status: 401,
                        body: formatResponse(false, MSG.INVALID_CREDENTIALS)
                    });
                    return;
                }

                // Encode the provided password to compare with stored password
                const encodedPassword = encodePassword(password);

                // Compare encoded password with stored password
                if (!comparePasswords(encodedPassword, user[USER_FIELDS.PASSWORD])) {
                    console.log('Password incorrect');
                    resolve({
                        status: 401,
                        body: formatResponse(false, MSG.INVALID_CREDENTIALS)
                    });
                    return;
                }

                // Login successful - remove password from response
                const userCopy = {};
                userCopy[USER_FIELDS.ID] = user[USER_FIELDS.ID];
                userCopy[USER_FIELDS.USERNAME] = user[USER_FIELDS.USERNAME];
                userCopy[USER_FIELDS.EMAIL] = user[USER_FIELDS.EMAIL];

                console.log('Login successful:', user[USER_FIELDS.USERNAME]);

                resolve({
                    status: 200,
                    body: formatResponse(true, MSG.LOGIN_SUCCESS, {user: userCopy})
                });
            })
            .catch(function (error) {
                // This function runs if database operation fails
                console.error('Database error:', error.message);
                reject(error); // Pass error to whoever called this function
            });
    });
}

// Register function using promises
function register(userData) {
    console.log('Registration for:', userData.username);

    return new Promise(function (resolve, reject) {
        const username = userData.username;
        const email = userData.email;
        const password = userData.password;

        // Check all required fields
        if (!username || !email || !password) {
            resolve({
                status: 400,
                body: formatResponse(false, MSG.ALL_FIELDS_REQUIRED)
            });
            return;
        }

        // Validate username
        if (!validateUsername(username)) {
            resolve({
                status: 400,
                body: formatResponse(false, MSG.USERNAME_SHORT)
            });
            return;
        }

        // Validate password
        if (!validatePassword(password)) {
            resolve({
                status: 400,
                body: formatResponse(false, MSG.PASSWORD_SHORT)
            });
            return;
        }

        // Validate email
        if (!validateEmail(email)) {
            resolve({
                status: 400,
                body: formatResponse(false, MSG.EMAIL_INVALID)
            });
            return;
        }

        // Create new user data object
        const newUserData = {};
        newUserData[USER_FIELDS.USERNAME] = username;
        newUserData[USER_FIELDS.EMAIL] = email;
        newUserData[USER_FIELDS.PASSWORD] = encodePassword(password); // Encode password

        User.create(newUserData)
            .then(function (doc) {
                // User created successfully
                const user = {};
                user[USER_FIELDS.ID] = doc.id;
                user[USER_FIELDS.USERNAME] = doc[USER_FIELDS.USERNAME];
                user[USER_FIELDS.EMAIL] = doc[USER_FIELDS.EMAIL];

                console.log('User registered with ID:', doc.id);

                resolve({
                    status: 201,
                    body: formatResponse(true, MSG.REGISTER_SUCCESS, {user: user})
                });
            })
            .catch(function (error) {
                console.error('Database error:', error.message);

                // Check if error is because username/email already exists
                if (error && error.code === 11000) {
                    resolve({
                        status: 409,
                        body: formatResponse(false, MSG.DUPLICATE_USER)
                    });
                } else {
                    resolve({
                        status: 500,
                        body: formatResponse(false, MSG.SERVER_ERROR)
                    });
                }
            });
    });
}

// Update profile function
function updateProfile(updateData) {
    console.log('Profile update for user ID:', updateData.userId);

    return new Promise(function (resolve, reject) {
        const userId = updateData.userId;
        const currentPassword = updateData.currentPassword;
        const newUsername = updateData.newUsername;
        const newPassword = updateData.newPassword;

        // Check if user ID and current password are provided
        if (!userId || !currentPassword) {
            resolve({
                status: 400,
                body: formatResponse(false, MSG.ALL_FIELDS_REQUIRED)
            });
            return;
        }

        // Check if at least one field to update is provided
        if (!newUsername && !newPassword) {
            resolve({
                status: 400,
                body: formatResponse(false, MSG.NO_CHANGES_MADE)
            });
            return;
        }

        // First, find and verify the user with current password
        User.findById(userId)
            .select(USER_FIELDS.ID + ' ' + USER_FIELDS.USERNAME + ' ' + USER_FIELDS.EMAIL + ' ' + USER_FIELDS.PASSWORD)
            .lean()
            .then(function (user) {
                if (!user) {
                    resolve({
                        status: 404,
                        body: formatResponse(false, MSG.USER_NOT_FOUND)
                    });
                    return;
                }

                // Verify current password
                const encodedCurrentPassword = encodePassword(currentPassword);
                if (!comparePasswords(encodedCurrentPassword, user[USER_FIELDS.PASSWORD])) {
                    resolve({
                        status: 401,
                        body: formatResponse(false, MSG.CURRENT_PASSWORD_INCORRECT)
                    });
                    return;
                }

                // Prepare update data
                const updateFields = {};

                // Validate and add new username if provided
                if (newUsername) {
                    if (!validateUsername(newUsername)) {
                        resolve({
                            status: 400,
                            body: formatResponse(false, MSG.USERNAME_SHORT)
                        });
                        return;
                    }
                    updateFields[USER_FIELDS.USERNAME] = newUsername;
                }

                // Validate and add new password if provided
                if (newPassword) {
                    if (!validatePassword(newPassword)) {
                        resolve({
                            status: 400,
                            body: formatResponse(false, MSG.PASSWORD_SHORT)
                        });
                        return;
                    }
                    updateFields[USER_FIELDS.PASSWORD] = encodePassword(newPassword);
                }

                // Update the user
                User.findByIdAndUpdate(
                    userId,
                    updateFields,
                    {new: true, runValidators: true}
                )
                    .select(USER_FIELDS.ID + ' ' + USER_FIELDS.USERNAME + ' ' + USER_FIELDS.EMAIL)
                    .lean()
                    .then(function (updatedUser) {
                        console.log('Profile updated for user:', updatedUser[USER_FIELDS.USERNAME]);

                        const userResponse = {};
                        userResponse[USER_FIELDS.ID] = updatedUser[USER_FIELDS.ID];
                        userResponse[USER_FIELDS.USERNAME] = updatedUser[USER_FIELDS.USERNAME];
                        userResponse[USER_FIELDS.EMAIL] = updatedUser[USER_FIELDS.EMAIL];

                        resolve({
                            status: 200,
                            body: formatResponse(true, MSG.PROFILE_UPDATE_SUCCESS, {user: userResponse})
                        });
                    })
                    .catch(function (error) {
                        console.error('Update error:', error.message);

                        // Check if error is because username already exists
                        if (error && error.code === 11000) {
                            resolve({
                                status: 409,
                                body: formatResponse(false, MSG.DUPLICATE_USER)
                            });
                        } else {
                            resolve({
                                status: 500,
                                body: formatResponse(false, MSG.SERVER_ERROR)
                            });
                        }
                    });
            })
            .catch(function (error) {
                console.error('Database error:', error.message);
                reject(error);
            });
    });
}
// Add this function to the existing authService.js file after the updateProfile function

// Delete profile function
function deleteProfile(deleteData) {
    console.log('Profile deletion for user ID:', deleteData.userId);

    return new Promise(function (resolve, reject) {
        const userId = deleteData.userId;
        const currentPassword = deleteData.currentPassword;

        // Check if user ID and current password are provided
        if (!userId || !currentPassword) {
            resolve({
                status: 400,
                body: formatResponse(false, MSG.ALL_FIELDS_REQUIRED)
            });
            return;
        }

        // First, find and verify the user with current password
        User.findById(userId)
            .select(USER_FIELDS.ID + ' ' + USER_FIELDS.USERNAME + ' ' + USER_FIELDS.EMAIL + ' ' + USER_FIELDS.PASSWORD)
            .lean()
            .then(function (user) {
                if (!user) {
                    resolve({
                        status: 404,
                        body: formatResponse(false, MSG.USER_NOT_FOUND)
                    });
                    return;
                }

                // Verify current password
                const encodedCurrentPassword = encodePassword(currentPassword);
                if (!comparePasswords(encodedCurrentPassword, user[USER_FIELDS.PASSWORD])) {
                    resolve({
                        status: 401,
                        body: formatResponse(false, MSG.CURRENT_PASSWORD_INCORRECT)
                    });
                    return;
                }

                // Delete the user
                User.findByIdAndDelete(userId)
                    .then(function (deletedUser) {
                        console.log('Profile deleted for user:', deletedUser[USER_FIELDS.USERNAME]);

                        resolve({
                            status: 200,
                            body: formatResponse(true, MSG.PROFILE_DELETE_SUCCESS)
                        });
                    })
                    .catch(function (error) {
                        console.error('Delete error:', error.message);
                        resolve({
                            status: 500,
                            body: formatResponse(false, MSG.SERVER_ERROR)
                        });
                    });
            })
            .catch(function (error) {
                console.error('Database error:', error.message);
                reject(error);
            });
    });
}

// Update the exports to include the new function
module.exports = {
    login: login,
    register: register,
    updateProfile: updateProfile,
    deleteProfile: deleteProfile
};

