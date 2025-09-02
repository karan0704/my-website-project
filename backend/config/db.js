// config/db.js
// MongoDB connect

const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

// Configure mongoose settings
mongoose.set('strictQuery', true);

// connect to MongoDB
function connectDB() {
    console.log('Connecting to MongoDB...');

    return mongoose.connect(MONGO_URI, {
        autoIndex: true, // Create indexes automatically in development
    })
        .then(function() {
            console.log('Connected to MongoDB');
        })
        .catch(function(error) {
            console.error('MongoDB connection failed:', error.message);
            throw error;
        });
}

module.exports = { connectDB: connectDB };
