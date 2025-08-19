const express = require("express");
const router = express.Router();

console.log("🔐 Loading auth routes...");

// Register user
router.post("/register", (req, res) => {
    console.log("📝 POST /api/auth/register - User registration");

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            error: "Missing required fields",
            message: "Please provide username, email, and password."
        });
    }

    // Simple password hashing (in production, use bcrypt)
    const hashedPassword = Buffer.from(password).toString('base64');

    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    global.db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    error: "User already exists",
                    message: "Username or email already registered."
                });
            }

            console.error("❌ Database error:", err.message);
            return res.status(500).json({
                error: "Registration failed",
                message: err.message
            });
        }

        console.log(`✅ User registered successfully: ${username}`);
        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            userId: result.insertId
        });
    });
});

// Login user
router.post("/login", (req, res) => {
    console.log("🔑 POST /api/auth/login - User login");

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: "Missing credentials",
            message: "Please provide username and password."
        });
    }

    const hashedPassword = Buffer.from(password).toString('base64');
    const query = "SELECT id, username, email FROM users WHERE username = ? AND password = ?";

    global.db.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err.message);
            return res.status(500).json({
                error: "Login failed",
                message: err.message
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                error: "Invalid credentials",
                message: "Username or password incorrect."
            });
        }

        console.log(`✅ User logged in successfully: ${username}`);
        res.json({
            success: true,
            message: "Login successful!",
            user: results[0]
        });
    });
});

console.log("✅ Auth routes loaded");
module.exports = router;
