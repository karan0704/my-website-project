// config/db.js
// MongoDB connection setup using Mongoose

const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

// Configure mongoose settings
mongoose.set('strictQuery', true);

// Function to connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            autoIndex: true, // Create indexes automatically in development
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        throw error;
    }
}

module.exports = { connectDB };
