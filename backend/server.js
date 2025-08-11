//Packages
const express = require("express");

mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
console.log("Middleware setup in process");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
console.log("Middleware setup complete");

console.log("Connecting to database...");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.log("Exiting application...");
    return;
  }
  console.log("✅ Connected to database");
  console.log(`Database connection details:
  Host: ${process.env.DB_HOST}
  User: ${process.env.DB_USER}
  Database: ${process.env.DB_NAME}
`);
});
app.get("/", (req, res) => {
  res.send({
    message: "🚀 Backend is running!",
    status: "Success",
    author: "Anuj",
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
