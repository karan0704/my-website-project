const express = require("express");
const router = express.Router();

console.log("📝 Loading todos routes...");

// GET all todos
// GET all todos - UPDATED to filter by user
router.get("/", (req, res) => {
    console.log("📡 Someone visited /api/todos - fetching from database...");

    // Get user_id from query parameters
    const { user_id } = req.query;

    let query, queryParams;

    if (user_id) {
        // Filter by specific user
        query = "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC";
        queryParams = [user_id];
    } else {
        // Get all todos (for admin or when no user specified)
        query = "SELECT * FROM todos ORDER BY created_at DESC";
        queryParams = [];
    }

    global.db.query(query, queryParams, (err, results) => {
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
            message: "Todos fetched successfully!",
            count: results.length,
            todos: results,
        });
    });
});

// GET single todo by ID
router.get("/:id", (req, res) => {
    console.log(`📋 GET /api/todos/${req.params.id} - Fetching single todo`);

    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({
            error: "Invalid todo ID",
            message: "Please provide a valid numeric ID."
        });
    }

    const query = "SELECT * FROM todos WHERE id = ?";
    global.db.query(query, [id], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err.message);
            return res.status(500).json({
                error: "Could not fetch todo",
                message: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: "Todo not found",
                message: "No todo exists with the provided ID."
            });
        }

        console.log(`✅ Found todo with ID ${id}`);
        res.json({
            success: true,
            message: "Todo fetched successfully!",
            todo: results[0]
        });
    });
});

// POST method - Create new todo
router.post("/", (req, res) => {
    console.log("📝 POST /api/todos - Creating new todo");
    console.log("📦 Data received:", req.body);

    const { task, priority = 'medium', category = 'general', due_date, user_id } = req.body;

    if (!task || task.trim() === "") {
        console.log("❌ No task provided");
        return res.status(400).json({
            error: "Task is required",
            message: "Please provide a valid task description.",
        });
    }

    const cleanTask = task.trim();
    const query = "INSERT INTO todos (task, completed, priority, category, due_date, user_id) VALUES (?, false, ?, ?, ?, ?)";

    global.db.query(query, [cleanTask, priority, category, due_date || null, user_id || null], (err, result) => {
        if (err) {
            console.error("❌ Database error:", err.message);
            return res.status(500).json({
                error: "Failed to create todo",
                message: err.message,
            });
        }

        console.log(`✅ Todo created successfully: ${result.insertId}, task: ${cleanTask}`);
        res.status(201).json({
            success: true,
            message: "Todo created successfully!",
            todo: {
                id: result.insertId,
                task: cleanTask,
                priority,
                category,
                due_date: due_date || null,
                user_id: user_id || null
            },
        });
    });
});

// PUT method - Update todo
router.put("/:id", (req, res) => {
    console.log(`🔄 PUT /api/todos/${req.params.id} - Updating todo`);

    const { id } = req.params;
    const { task, completed, priority, category, due_date } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            error: "Invalid todo ID",
            message: "Please provide a valid numeric ID."
        });
    }

    let query = "UPDATE todos SET ";
    let values = [];
    let updates = [];

    if (task !== undefined) {
        updates.push("task = ?");
        values.push(task.trim());
    }

    if (completed !== undefined) {
        updates.push("completed = ?");
        values.push(completed);
    }

    if (priority !== undefined) {
        updates.push("priority = ?");
        values.push(priority);
    }

    if (category !== undefined) {
        updates.push("category = ?");
        values.push(category);
    }

    if (due_date !== undefined) {
        updates.push("due_date = ?");
        values.push(due_date || null);
    }

    if (updates.length === 0) {
        return res.status(400).json({
            error: "No updates provided",
            message: "Please provide fields to update."
        });
    }

    query += updates.join(", ") + " WHERE id = ?";
    values.push(id);

    global.db.query(query, values, (err, result) => {
        if (err) {
            console.error("❌ Database error:", err.message);
            return res.status(500).json({
                error: "Failed to update todo",
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Todo not found",
                message: "No todo exists with the provided ID."
            });
        }

        console.log(`✅ Todo updated successfully: ID ${id}`);
        res.json({
            success: true,
            message: "Todo updated successfully!"
        });
    });
});

// DELETE method - Delete todo
router.delete("/:id", (req, res) => {
    console.log(`🗑️ DELETE /api/todos/${req.params.id} - Deleting todo`);

    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            error: "Invalid todo ID",
            message: "Please provide a valid numeric ID."
        });
    }

    const query = "DELETE FROM todos WHERE id = ?";

    global.db.query(query, [id], (err, result) => {
        if (err) {
            console.error("❌ Database error:", err.message);
            return res.status(500).json({
                error: "Failed to delete todo",
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Todo not found",
                message: "No todo exists with the provided ID."
            });
        }

        console.log(`✅ Todo deleted successfully: ID ${id}`);
        res.json({
            success: true,
            message: "Todo deleted successfully!"
        });
    });
});

console.log("✅ Todos routes loaded");
module.exports = router;
