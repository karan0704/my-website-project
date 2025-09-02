// app.js
// Simple Express app setup

const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors()); // Allow all origins for simplicity
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/users', require('./routes/users'));

// Basic home route
app.get('/', function(req, res) {
    res.json({ message: 'Server is running!' });
});

module.exports = app;
