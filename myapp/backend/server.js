import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import mysql from "mysql2";
import { uploadToS3 } from "./s3.js";

dotenv.config();
const app = express();
const PORT = 5000;
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(bodyParser.json());

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

const promisePool = db.promise();

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database!");
    connection.release();
  }
});

app.post("/report-page", async (req, res) => {
  const { firstname, lastname, description, phone_number, address, title } = req.body;

  if (!description || !phone_number || !address || !title) {
    return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });
  }

  try {
    const[result] = await promisePool.execute(
      `INSERT INTO Report (firstname, lastname, description, phone_number, address, title) VALUES (?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, description, phone_number, address, title]
    );
    res.status(200).json({ message: "บันทึกข้อมูลเรียบร้อย", reportId: result.insertId })
  } catch (err){
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
  console.log("📦 req.body =", req.body);
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
