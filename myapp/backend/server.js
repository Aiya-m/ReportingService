import 'dotenv/config';
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import multer from "multer";
import mysql from "mysql2";
import { uploadToS3 } from "./s3.js";
import nodemailer from "nodemailer";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminEnableUserCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import dotenv from "dotenv";

import {
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";

dotenv.config();

const app = express();
const PORT = 5000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "resqapp.app@gmail.com",
    pass: "azpg khqs blhx brba"
  },
});

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(bodyParser.json({ limit: "20mb" }));


const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  },
});

const userPoolId = "us-east-1_4wFdFGByS";

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

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});
const USER_POOL_ID = "us-east-1_4wFdFGByS";

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

const transformCognitoUser = (cognitoUser, Role) => {
  const attributes = cognitoUser.Attributes.reduce((acc, attr) => {
    acc[attr.Name] = attr.Value;
    return acc;
  }, {});
  console.log(attributes['custom:Role'])

  let displayStatus;

  if (cognitoUser.Enabled === false) {
    displayStatus = 'Disabled';
  } else {
    displayStatus = 'Enabled';
  }

  if (attributes['custom:Role'] == Role) {
    return {
      username: cognitoUser.Username,
      status: cognitoUser.UserStatus,
      createdAt: cognitoUser.UserCreateDate,
      email: attributes.email,
      phone: attributes.phone_number,
      firstname: attributes.given_name,
      lastname: attributes.family_name,
      address: attributes['custom:address'],
      department: attributes['custom:department'],
      officer_id: attributes['custom:officer_id'],
      citizen_id: attributes['custom:citizen_id'],
      displayStatus: displayStatus
    };
  }
  return null;
};

const getCognitoOfficer = (cognitoUser, Department) => {
  const attributes = cognitoUser.Attributes.reduce((acc, attr) => {
    acc[attr.Name] = attr.Value;
    return acc;
  }, {});

  let displayStatus;

  if (cognitoUser.Enabled === false) {
    displayStatus = 'Disabled';
  } else {
    displayStatus = 'Enabled';
  }

  if (attributes['custom:department'] == Department) {
    return {
      username: cognitoUser.Username,
      status: cognitoUser.UserStatus,
      createdAt: cognitoUser.UserCreateDate,
      email: attributes.email,
      phone: attributes.phone_number,
      firstname: attributes.given_name,
      lastname: attributes.family_name,
      address: attributes['custom:address'],
      department: attributes['custom:department'],
      officer_id: attributes['custom:officer_id'],
      citizen_id: attributes['custom:citizen_id'],
      displayStatus: displayStatus
    };
  }
  return null;
};


app.post('/api/disable-user', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };

  try {
    const command = new AdminDisableUserCommand(params);
    await cognitoClient.send(command);

    res.status(200).json({ message: "User disabled successfully" });

  } catch (error) {
    console.error("Error disabling user:", error);
    res.status(500).json({ error: "Failed to disable user" });
  }
  if (!description || !phone_number || !address || !title) {
    return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });
  }

});

app.post("/", async (req, res) => {
  const { firstname, lastname, phone_number, latitude, longitude, is_emergency, title, description } = req.body;

  if (!firstname || !lastname || !phone_number || !latitude || !longitude || !title) {
    return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });
  }
  const params = {
    UserPoolId: USER_POOL_ID,
  };

  let Department;
  if (title === "ไฟไหม้") {
    Department = "สถานีดับเพลิง";
  } else if (title === "อุบัติเหตุท้องถนน") {
    Department = "ตำรวจจราจร";
  } else if (title === "บาดเจ็บ/ป่วยฉุกเฉิน") {
    Department = "โรงพยาบาล";
  } else if (title === "ทะเลาะวิวาท") {
    Department = "ตำรวจแห่งชาติ";
  } else if (title === "สัตว์อันตราย") {
    Department = "กู้ภัย";
  } else if (title === "ไฟดับ") {
    Department = "การไฟฟ้า";
  } else if (title === "น้ำไม่ไหล") {
    Department = "การประปา";
  } else if (title === "โจรกรรม") {
    Department = "ตำรวจแห่งชาติ";
  }
  
  try {
    const [result] = await promisePool.execute(
        `INSERT INTO Report (firstname, lastname, phone_number, latitude, longitude, is_emergency, title, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [firstname, lastname, phone_number, latitude, longitude, is_emergency, title, description]
      );
    
      const command = new ListUsersCommand(params);
      const response = await cognitoClient.send(command);
      const formattedUsers = response.Users.map(user => getCognitoOfficer(user, Department)).filter(Boolean);
      for(let i=0; i<formattedUsers.length; i++){
        await transporter.sendMail({
          from: '"Emergency System" resqapp.app@gmail.com',
          to: formattedUsers[i].email,
          subject: "Emergency Reported",
          text: "มีรายงานเหตุฉุกเฉิน กรุณาเข้าเว็ปไซต์เพื่อดูรายละเอียด",
        });
  
      }

    res.status(200).json({ message: "บันทึกข้อมูลเรียบร้อย", reportId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
  console.log("req.body =", req.body);
});

app.get("/reports", async (req, res) => {
  const { firstname, lastname } = req.query;

  if (!firstname || !lastname) {
    return res.status(400).json({ message: "ต้องระบุ firstname และ lastname" });
  }

  try {
    const [rows] = await promisePool.execute(
      "SELECT id, title, address, status, DATE_FORMAT(created_at, '%d %b %Y') as date, TIME_FORMAT(created_at, '%H:%i น.') as time FROM Report WHERE firstname = ? AND lastname = ? ORDER BY created_at DESC",
      [firstname, lastname]
    );

    res.status(200).json({ reports: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

app.get("/reports/pending", async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT id, title, address, status, DATE_FORMAT(created_at, '%d %b %Y') as date, TIME_FORMAT(created_at, '%H:%i น.') as time FROM Report WHERE status = 'รอดำเนินการ' ORDER BY created_at DESC"
    );
    res.status(200).json({ reports: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

app.get("/api", (req, res) => {
  res.json({ "users": ["userOne", "userTwo", "userThree"] })
})

app.get("/caution_position", async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      `SELECT latitude, longitude 
       FROM Report 
       WHERE is_emergency = TRUE 
         AND status != 'สำเร็จแล้ว'
         AND latitude IS NOT NULL 
         AND longitude IS NOT NULL`
    );

    const locations = rows.map(row => [
      parseFloat(row.longitude),
      parseFloat(row.latitude)
    ]);

    res.json({ locations });
  } catch (err) {
    console.error("Error fetching caution positions:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลพิกัด" });
  }
});


app.get("/get-departments-list", (req, res) => {
  const query = "SELECT * FROM Department";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
  })
});

app.get('/api/users', async (req, res) => {
  const params = {
    UserPoolId: USER_POOL_ID,
  };
  const Role = req.query.isOfficer;
  console.log(Role)

  try {
    const command = new ListUsersCommand(params);
    const response = await cognitoClient.send(command);
    const formattedUsers = response.Users.map(user => transformCognitoUser(user, Role)).filter(Boolean);
    res.json(formattedUsers);
  } catch (error) {
    console.error("ไม่สามารถแสดงข้อมูลจาก Cognito :", error);
    res.status(500).json({ error: "ไม่สามารถแสดงข้อมูล" });
  }
});

app.post('/api/confirm-user', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "ระบบต้องการผู้ใช้" });
  }

  const params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };

  try {
    const command = new AdminEnableUserCommand(params);
    await cognitoClient.send(command);
    res.status(200).json({ message: "เปลี่ยนสถานะผู้ใช้สำเร็จ" });
  } catch (error) {
    console.error("Error confirming user:", error);
    res.status(500).json({ error: "ไม่สามารถเปลี่ยนสถานะผู้ใช้" });
  }
});

app.post('/api/delete-user', async (req, res) => {

  const { username } = req.body;


  if (!username) {
    return res.status(400).json({ error: "ระบบต้องการผู้ใช้" });
  }


  const params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };


  try {
    const command = new AdminDeleteUserCommand(params);
    await cognitoClient.send(command);

    res.status(200).json({ message: "ลบผู้ใช้สำเร็จ!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "ไม่สามารถลบผู้ใช้" });
  }
});


app.post("/report-page", async (req, res) => {
  const { firstname, lastname, description, phone_number, address, title, attachment } = req.body;

  if (!description || !phone_number || !address || !title) {
    return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });
  }

  try {
    const [result] = await promisePool.execute(
      `INSERT INTO Report (firstname, lastname, description, phone_number, address, title, attachment) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, description, phone_number, address, title, attachment]
    );
    res.status(200).json({ message: "บันทึกข้อมูลเรียบร้อย", reportId: result.insertId })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
  console.log("📦 req.body =", req.body);
});


app.get("/reports/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await promisePool.execute("SELECT * FROM Report WHERE id = ?", [id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "Report not found" });
  }
  res.json({ report: rows[0] });
});

app.put("/reports/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await promisePool.execute("UPDATE Report SET status = ? WHERE id = ?", [status, id]);
  res.json({ message: "Status updated successfully" });
});


app.post("/", async (req, res) => {
  const { firstname, lastname, phone_number, latitude, longitude, is_emergency, title, description, attachment } = req.body;

  if (!firstname || !lastname || !phone_number || !latitude || !longitude || !title) {
    return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });
  }

  try {
    const [result] = await promisePool.execute(
      `INSERT INTO Report (firstname, lastname, phone_number, latitude, longitude, is_emergency, title, description, attachment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, phone_number, latitude, longitude, is_emergency, title, description, attachment]
    );
    res.status(200).json({ message: "บันทึกข้อมูลเรียบร้อย", reportId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
  console.log("📦 req.body =", req.body);
});

app.get("/reports", async (req, res) => {
  const { firstname, lastname } = req.query;

  if (!firstname || !lastname) {
    return res.status(400).json({ message: "ต้องระบุ firstname และ lastname" });
  }

  try {
    const [rows] = await promisePool.execute(
      "SELECT id, title, address, status, DATE_FORMAT(created_at, '%d %b %Y') as date, TIME_FORMAT(created_at, '%H:%i น.') as time FROM Report WHERE firstname = ? AND lastname = ? ORDER BY created_at DESC",
      [firstname, lastname]
    );

    res.status(200).json({ reports: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

app.get("/reports-pending", async (req, res) => {
  console.log("✅ /reports/pending route called");
  try {
    const [rows] = await promisePool.execute(
      "SELECT id, title, address, status, DATE_FORMAT(created_at, '%d %b %Y') as date, TIME_FORMAT(created_at, '%H:%i น.') as time FROM Report WHERE status = 'รอดำเนินการ' ORDER BY created_at DESC"
    );
    res.status(200).json({ reports: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

app.get("/reports-progress", async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT id, title, address, status, DATE_FORMAT(created_at, '%d %b %Y') as date, TIME_FORMAT(created_at, '%H:%i น.') as time FROM Report WHERE status = 'กำลังดำเนินการ' ORDER BY created_at DESC"
    );
    res.status(200).json({ reports: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

app.get("/reports-complete", async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT id, title, address, status, DATE_FORMAT(created_at, '%d %b %Y') as date, TIME_FORMAT(created_at, '%H:%i น.') as time FROM Report WHERE status = 'สำเร็จ' ORDER BY created_at DESC"
    );
    res.status(200).json({ reports: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

app.get("/api", (req, res) => {
  res.json({ "users": ["userOne", "userTwo", "userThree"] })
})

app.get("/caution_position", (req, res) => {
  res.json({ "locations": [[100.7887341, 13.7348824], [98.9792, 18.7961], [102.839, 16.4419]] })
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

app.post("/manage-profile", async (req, res) => {

  try {
    const { username, firstname, lastname, phone_number } = req.body;
    const address = req.body.address || "";

    await client.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId,
        Username: username,
        UserAttributes: [
          { Name: "given_name", Value: firstname },
          { Name: "family_name", Value: lastname },
          { Name: "phone_number", Value: phone_number },
          { Name: "custom:address", Value: address },
        ],
      })
    );

    res.json({ success: true, redirectTo: "/profile" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));