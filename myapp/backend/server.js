require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { uploadToS3 } = require("./s3");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = 5000;
app.use(cors({ origin: "*" }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/images", upload.single("image"), async (req, res) => {
  const { file } = req;
  const userId = req.headers["x-user-id"];

  if (!file || !userId) {
    return res.status(400).json({ message: "Bad request" });
  }

  const { error, key } = await uploadToS3({ file, userId });
  if (error) return res.status(500).json({ message: error.message });

  return res.status(201).json({ key });
});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database!");
    connection.release();
  }
});

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

app.get("/api", (req, res) => {
  res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.get("/caution_position", (req, res) => {    
  res.json({"locations": [[100.7887341, 13.7348824], [98.9792, 18.7961], [102.839, 16.4419]]})
})

app.get("/get-departments-list", (req, res) => {
  const query = "SELECT * FROM Department";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
