// models/User.js
// Mongoose schema definition for User collection

const mongoose = require('mongoose');
const { USER_FIELDS, ROLES, COLLECTIONS } = require('../config/constants');

// Define user schema with validation
const userSchema = new mongoose.Schema(
    {
        [USER_FIELDS.USERNAME]: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        },
        [USER_FIELDS.EMAIL]: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        [USER_FIELDS.PASSWORD]: {
            type: String,
            required: true,
            minlength: 6
        },
        [USER_FIELDS.ROLE]: {
            type: String,
            default: ROLES.USER
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt
        collection: COLLECTIONS.USERS
    }
);

module.exports = mongoose.model('User', userSchema);
