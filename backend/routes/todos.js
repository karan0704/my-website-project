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

router.post("/", (req, res) => {
  console.log(" POST /api/todos - Creating new todo");
  console.log("📦 Data received:", req.body);

  const { task } = req.body;

  if (!task || task.trim() === "") {
    console.log("❌ No task provided");
    return res.status(400).json({
      error: "Task is required",
      message: "Please provide a valid task description.",
    });
  }
  const cleanTask = task.trim();

  const query = "INSERT INTO todos (task, completed) VALUES (?, false)";

  global.db.query(query, [cleanTask], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err.message);
      return res.status(500).json({
        error: "Failed to create todo",
        message: err.message,
      });
    }

    console.log(
      `✅ Todo created successfully: ${result.insertId}, task: ${cleanTask}`
    );
    res.status(201).json({
      success: true,
      message: "Todo created successfully!",
      todo: { id: result.insertId, task: cleanTask },
    });
  });
});

console.log("✅ Todos routes loaded");
module.exports = router;
