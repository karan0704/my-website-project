// models/Auth.js
// Simple authentication model without bcrypt

const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Simple password comparison method
authSchema.methods.comparePassword = function(candidatePassword) {
    // Direct comparison - decode Base64 if needed
    let storedPassword = this.password;

    // If password looks like Base64, decode it
    if (storedPassword.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
        try {
            storedPassword = Buffer.from(storedPassword, 'base64').toString();
        } catch (e) {
            // If decoding fails, use as is
        }
    }

    return candidatePassword === storedPassword;
};

module.exports = mongoose.model('Auth', authSchema, 'auths'); // Use 'auths' collection
