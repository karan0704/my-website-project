const express = require("express");
const router = express.Router();

console.log("📝 Loading todos routes...");

router.get("/", (req, res) => {
  console.log("📡 Someone visited /api/todos");

  res.json({
    message: "Todos API is working!",
    author: "Anuj",
  });
});

console.log("✅ Todos routes loaded");

module.exports = router;
