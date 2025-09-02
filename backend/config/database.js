// config/database.js
// Simple MongoDB connection

const mongoose = require('mongoose');

// Simple connection function
function connectDB() {
    console.log('Connecting to MongoDB...');

    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/my_website';

    return mongoose.connect(mongoURI)
        .then(function() {
            console.log('MongoDB connected successfully');
        })
        .catch(function(error) {
            console.error('MongoDB connection failed:', error.message);
            throw error;
        });
}

module.exports = { connectDB };
