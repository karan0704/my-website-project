// ============================================================================
// BACKEND SERVER - Complete Authentication System
// ============================================================================
// This file sets up an Express server with MySQL database for user authentication

// IMPORT REQUIRED PACKAGES
// ========================
const express = require("express");      // Web framework for creating REST APIs
const mysql = require("mysql2");         // MySQL database driver for Node.js
const cors = require("cors");            // Cross-Origin Resource Sharing middleware
require("dotenv").config();              // Load environment variables from .env file

// CREATE EXPRESS APPLICATION
// ==========================
const app = express();

console.log("🚀 Starting backend server setup...");

// ENVIRONMENT VARIABLES VALIDATION
// =================================
// Check if all required environment variables exist before starting server
const requiredEnvVars = [
    'DB_HOST',      // Database host (localhost)
    'DB_USER',      // Database username (root)
    'DB_PASSWORD',  // Database password
    'DB_NAME',      // Database name (my_website)
    'PORT',         // Server port (5000)
    'FRONTEND_URL'  // Frontend URL for CORS (http://localhost:3000)
];

console.log("🔍 Validating environment variables...");

// Check each required variable and collect missing ones
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

// If any variables are missing, exit with error message
if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error("📝 Please add missing variables to your .env file");
    process.exit(1);  // Exit with error code
}

console.log("✅ All environment variables validated successfully");

// MIDDLEWARE SETUP
// ================
// Middleware functions that process requests before they reach route handlers

// CORS (Cross-Origin Resource Sharing) - Allow React frontend to call our API
app.use(cors({
    origin: process.env.FRONTEND_URL,     // Only allow requests from React app
    credentials: true                     // Allow cookies and authentication headers
}));

// Body parsing middleware - Convert JSON request bodies to JavaScript objects
app.use(express.json());

// URL encoding middleware - Parse form data from POST requests
app.use(express.urlencoded({ extended: true }));

console.log("✅ Middleware configured successfully");

// DATABASE CONNECTION
// ===================
console.log("🔌 Connecting to MySQL database...");

// Create MySQL connection using environment variables (no hardcoded values)
const db = mysql.createConnection({
    host: process.env.DB_HOST,        // Database server location
    user: process.env.DB_USER,        // Database username
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DB_NAME     // Database name
});

// Display connection details (without password for security)
console.log("📊 Database connection details:");
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   User: ${process.env.DB_USER}`);
console.log(`   Database: ${process.env.DB_NAME}`);

// Attempt to connect to database
db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        console.error("🔍 Please check your database configuration");
        process.exit(1);  // Exit if database connection fails
    }
    console.log("✅ Successfully connected to MySQL database");
});

// AUTHENTICATION ROUTES
// ======================
// API endpoints for user login and registration

// LOGIN ENDPOINT - POST /api/auth/login
// =====================================
app.post("/api/auth/login", (req, res) => {
    console.log("🔑 Login request received");

    // Extract username and password from request body
    // req.body contains data sent from React frontend
    const { username, password } = req.body;
    console.log(`👤 Login attempt for username: ${username}`);

    // INPUT VALIDATION
    // ================
    // Check if both username and password are provided
    if (!username || !password) {
        console.log("❌ Missing credentials in request");
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    // PASSWORD ENCODING
    // =================
    // Convert password to base64 to match database storage format
    // NOTE: In production, use proper password hashing (bcrypt)
    const encodedPassword = Buffer.from(password).toString('base64');
    console.log(`🔍 Checking credentials in database...`);

    // DATABASE QUERY
    // ==============
    // SQL query to find user with matching username and password
    const query = "SELECT id, username, email FROM users WHERE username = ? AND password = ?";

    // Execute query with parameterized values (prevents SQL injection)
    db.query(query, [username, encodedPassword], (err, results) => {
        // Handle database errors
        if (err) {
            console.error("❌ Database error during login:", err.message);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }

        // Check if user was found (results array will be empty if no match)
        if (results.length === 0) {
            console.log("❌ Invalid credentials provided");
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // LOGIN SUCCESS
        // =============
        // User found, return user data (without password for security)
        const user = results[0];
        console.log(`✅ Login successful for user: ${user.username}`);

        // Send successful response with user data
        res.json({
            success: true,
            message: "Login successful!",
            user: user  // This data will be used by React frontend
        });
    });
});

// REGISTER ENDPOINT - POST /api/auth/register
// ===========================================
app.post("/api/auth/register", (req, res) => {
    console.log("📝 Registration request received");

    // Extract registration data from request body
    const { username, email, password } = req.body;
    console.log(`👤 Registration attempt for: ${username}, ${email}`);

    // INPUT VALIDATION
    // ================
    // Check if all required fields are provided
    if (!username || !email || !password) {
        console.log("❌ Missing required fields");
        return res.status(400).json({
            success: false,
            message: "Username, email, and password are required"
        });
    }

    // USERNAME VALIDATION
    // ===================
    if (username.length < 3) {
        console.log("❌ Username too short");
        return res.status(400).json({
            success: false,
            message: "Username must be at least 3 characters long"
        });
    }

    // EMAIL VALIDATION
    // ================
    // Regular expression to check valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log("❌ Invalid email format");
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address"
        });
    }

    // PASSWORD VALIDATION
    // ===================
    if (password.length < 6) {
        console.log("❌ Password too short");
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long"
        });
    }

    // PASSWORD ENCODING
    // =================
    // Encode password to match database format
    const encodedPassword = Buffer.from(password).toString('base64');

    // DATABASE INSERTION
    // ==================
    // SQL query to insert new user into database
    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    console.log("💾 Creating new user account...");

    // Execute insertion query
    db.query(query, [username, email, encodedPassword], (err, result) => {
        // Handle database errors
        if (err) {
            console.error("❌ Database error during registration:", err.message);

            // Check for duplicate username/email error
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: "Username or email already exists"
                });
            }

            // Other database errors
            return res.status(500).json({
                success: false,
                message: "Failed to create user account"
            });
        }

        // REGISTRATION SUCCESS
        // ====================
        // Get the ID of the newly created user
        const newUserId = result.insertId;
        console.log(`✅ User registered successfully with ID: ${newUserId}`);

        // Send successful response with new user data
        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: {
                id: newUserId,
                username: username,
                email: email
                // Never send password back to frontend
            }
        });
    });
});

// UTILITY ROUTES
// ==============
// Additional routes for testing and health checks

// Root endpoint - Test if server is running
app.get("/", (req, res) => {
    console.log("🏠 Root endpoint accessed");
    res.json({
        message: "🚀 Backend server is running!",
        status: "active",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint - Monitor server status
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString()
    });
});

// SERVER STARTUP
// ==============
// Start the Express server on specified port
const port = process.env.PORT;

app.listen(port, () => {
    console.log("=".repeat(50));
    console.log(`🎉 Server successfully started!`);
    console.log(`🌐 Server URL: http://localhost:${port}`);
    console.log(`📊 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
    console.log("=".repeat(50));
    console.log("🧪 Test with existing database users:");
    console.log("   demo_user / demo123");
    console.log("   Karan007 / 123456789");
    console.log("=".repeat(50));
});

// GRACEFUL SHUTDOWN
// =================
// Handle server shutdown gracefully
process.on('SIGTERM', () => {
    console.log('🛑 Server shutdown signal received');
    db.end(() => {
        console.log('📊 Database connection closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    process.exit(1);
});
