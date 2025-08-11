const express = require("express");
const router = express.Router();

console.log("📝 Loading todos routes...");

router.get("/", (req, res) => {
  console.log("📡 Someone visited /api/todos - fetching from database...");

  const query = "SELECT * FROM todos ORDER BY created_at DESC";

  global.db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Database error:", err.message);
      return res.status(500).json({
        error: "Could not fetch todos",
        message: err.message,
      });
    }

    console.log(`✅ Found ${results.length} todos in database`);
    res.json({
      success: true,
      message: "Todos API is working, Todos fetched from database!",
      count: results.length,
      todos: results,
    });
  });
});

console.log("✅ Todos routes loaded");
module.exports = router;
