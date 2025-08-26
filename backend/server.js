// Express server for user authentication

// Load environment variables
require("dotenv").config();

// IMPORT PACKAGES
// ===============

const app = require("./app");
const db = require("./config/db");

console.log("🚀 Starting backend server...");

// START SERVER
// ============
const port = process.env.PORT;

// Debug environment variables
console.log("🔍 Environment check:");
console.log("PORT:", process.env.PORT);
console.log("DB_HOST:", process.env.DB_HOST);

// Connect to database FIRST, then start server
db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1);
    }

    console.log("✅ Connected to database");

    app.listen(port, () => {
        console.log("=".repeat(40));
        console.log(`🎉 Server started on port ${port}`);
        console.log(`🌐 API available at: http://localhost:${port}`);
        console.log("=".repeat(40));
    });
});