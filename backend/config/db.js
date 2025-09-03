// config/db.js
// MongoDB connect

const mongoose = require('mongoose');
const {MONGO_URI} = require('./env');

// Configure mongoose settings
mongoose.set('strictQuery', true);

// connect to MongoDB
async function connectDB() {
    console.log('Connecting to MongoDB...');

    try {
        const dbConnect = await mongoose.connect(MONGO_URI, {
            autoIndex: true,
        });
        console.log('Connected to MongoDB');
        return dbConnect;
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        throw err;
    }
}

module.exports = {connectDB};
