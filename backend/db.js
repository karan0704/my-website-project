// DATABASE CONNECTION


// IMPORT PACKAGES
const mysql = require("mysql2"); // Database driver
require("dotenv").config(); // Load .env file

// ===================
const db = mysql.createConnection({
    host: process.env.DB_HOST, // Database location
    user: process.env.DB_USER, // Database username
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DB_NAME, // Database name
});

module.exports = db;
