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

// Parameter: credentials object with username and password
const login = async (credentials) => {
    console.log('Login attempt for:', credentials.username);

    const {username, password} = credentials;

    if (!username || !password) {
        return {
            status: 400,
            body: formatResponse(false, MSG.ALL_FIELDS_REQUIRED)
        };
    }

    try {
        const user = await User.findOne({
            [USER_FIELDS.USERNAME]: username
        })
            .select(
                `${USER_FIELDS.ID} 
                ${USER_FIELDS.USERNAME} 
                ${USER_FIELDS.EMAIL} 
                ${USER_FIELDS.PASSWORD}`
            )
            .lean(); // Returns plain JavaScript object

        if (!user) {
            console.log('User not found');
            return {
                status: 401,
                body: formatResponse(false, MSG.INVALID_CREDENTIALS)
            };
        }

        const encodedPassword = encodePassword(password);

        if (!comparePasswords(encodedPassword, user[USER_FIELDS.PASSWORD])) {
            console.log('Password incorrect');
            return {
                status: 401,
                body: formatResponse(false,
                    MSG.INVALID_CREDENTIALS)
            };
        }

        // Extract password and keep the rest in one line
        const {[USER_FIELDS.PASSWORD]: userPassword, ...userCopy} = user;

        console.log('Login successful:', userCopy[USER_FIELDS.USERNAME]);

        return {
            status: 200,
            body: formatResponse(true, MSG.LOGIN_SUCCESS, {user: userCopy})
        };

    } catch (err) {
        console.error('Database error:', err.message);
        throw (err); // Pass error to whoever called this function
    }
}

// Register function using promises
const register = async (userData) => {

    console.log('Registration for:', userData.username);

    const {username, email, password} = userData;

    if (!username || !email || !password) {
        return {
            status: 400,
            body: formatResponse(false, MSG.ALL_FIELDS_REQUIRED)
        };
    }

    if (!validateUsername(username)) {
        return {
            status: 400,
            body: formatResponse(false, MSG.USERNAME_SHORT)
        };
    }

    if (!validatePassword(password)) {
        return {
            status: 400,
            body: formatResponse(false, MSG.PASSWORD_SHORT)
        };
    }

    if (!validateEmail(email)) {
        return {
            status: 400,
            body: formatResponse(false, MSG.EMAIL_INVALID)
        };
    }


    try {
        const newUserData = {
            [USER_FIELDS.USERNAME]: username,
            [USER_FIELDS.EMAIL]: email,
            [USER_FIELDS.PASSWORD]: encodePassword(password)
        };

        const createdUser = await User.create(newUserData);

        // User created successfully
        const userResponse = {
            [USER_FIELDS.ID]: createdUser._id,
            [USER_FIELDS.USERNAME]: createdUser[USER_FIELDS.USERNAME],
            [USER_FIELDS.EMAIL]: createdUser[USER_FIELDS.EMAIL],
        };

        console.log('User registered with ID:', createdUser._id);

        return {
            status: 201,
            body: formatResponse(true,
                MSG.REGISTER_SUCCESS,
                {user: userResponse})
        };
    } catch (error) {
        console.error('Database error:', error.message);

        // Check if error is because username/email already exists
        if (error && error.code === 11000) {
            return {
                status: 409, body: formatResponse(false, MSG.DUPLICATE_USER)
            };
        } else {
            return {
                status: 500, body: formatResponse(false, MSG.SERVER_ERROR)
            };
        }
    }

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
                status: 400, body: formatResponse(false, MSG.ALL_FIELDS_REQUIRED)
            });
            return;
        }

        // Check if at least one field to update is provided
        if (!newUsername && !newPassword) {
            resolve({
                status: 400, body: formatResponse(false, MSG.NO_CHANGES_MADE)
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
                        status: 404, body: formatResponse(false, MSG.USER_NOT_FOUND)
                    });
                    return;
                }

                // Verify current password
                const encodedCurrentPassword = encodePassword(currentPassword);
                if (!comparePasswords(encodedCurrentPassword, user[USER_FIELDS.PASSWORD])) {
                    resolve({
                        status: 401, body: formatResponse(false, MSG.CURRENT_PASSWORD_INCORRECT)
                    });
                    return;
                }

                // Prepare update data
                const updateFields = {};

                // Validate and add new username if provided
                if (newUsername) {
                    if (!validateUsername(newUsername)) {
                        resolve({
                            status: 400, body: formatResponse(false, MSG.USERNAME_SHORT)
                        });
                        return;
                    }
                    updateFields[USER_FIELDS.USERNAME] = newUsername;
                }

                // Validate and add new password if provided
                if (newPassword) {
                    if (!validatePassword(newPassword)) {
                        resolve({
                            status: 400, body: formatResponse(false, MSG.PASSWORD_SHORT)
                        });
                        return;
                    }
                    updateFields[USER_FIELDS.PASSWORD] = encodePassword(newPassword);
                }

                // Update the user
                User.findByIdAndUpdate(userId, updateFields, {new: true, runValidators: true})
                    .select(USER_FIELDS.ID + ' ' + USER_FIELDS.USERNAME + ' ' + USER_FIELDS.EMAIL)
                    .lean()
                    .then(function (updatedUser) {
                        console.log('Profile updated for user:', updatedUser[USER_FIELDS.USERNAME]);

                        const userResponse = {};
                        userResponse[USER_FIELDS.ID] = updatedUser[USER_FIELDS.ID];
                        userResponse[USER_FIELDS.USERNAME] = updatedUser[USER_FIELDS.USERNAME];
                        userResponse[USER_FIELDS.EMAIL] = updatedUser[USER_FIELDS.EMAIL];

                        resolve({
                            status: 200, body: formatResponse(true, MSG.PROFILE_UPDATE_SUCCESS, {user: userResponse})
                        });
                    })
                    .catch(function (error) {
                        console.error('Update error:', error.message);

                        // Check if error is because username already exists
                        if (error && error.code === 11000) {
                            resolve({
                                status: 409, body: formatResponse(false, MSG.DUPLICATE_USER)
                            });
                        } else {
                            resolve({
                                status: 500, body: formatResponse(false, MSG.SERVER_ERROR)
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
                status: 400, body: formatResponse(false, MSG.ALL_FIELDS_REQUIRED)
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
                        status: 404, body: formatResponse(false, MSG.USER_NOT_FOUND)
                    });
                    return;
                }

                // Verify current password
                const encodedCurrentPassword = encodePassword(currentPassword);
                if (!comparePasswords(encodedCurrentPassword, user[USER_FIELDS.PASSWORD])) {
                    resolve({
                        status: 401, body: formatResponse(false, MSG.CURRENT_PASSWORD_INCORRECT)
                    });
                    return;
                }

                // Delete the user
                User.findByIdAndDelete(userId)
                    .then(function (deletedUser) {
                        console.log('Profile deleted for user:', deletedUser[USER_FIELDS.USERNAME]);

                        resolve({
                            status: 200, body: formatResponse(true, MSG.PROFILE_DELETE_SUCCESS)
                        });
                    })
                    .catch(function (error) {
                        console.error('Delete error:', error.message);
                        resolve({
                            status: 500, body: formatResponse(false, MSG.SERVER_ERROR)
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
    login: login, register: register, updateProfile: updateProfile, deleteProfile: deleteProfile
};