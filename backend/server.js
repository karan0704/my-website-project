// server.js
// Start the server

require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5010;

console.log('Starting server...');

// Connect to database first, then start server
connectDB()
    .then(function() {
        app.listen(PORT, function() {
            console.log('Server running on port ' + PORT);
            console.log('API available at: http://localhost:' + PORT);
        });
    })
    .catch(function(error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    });
