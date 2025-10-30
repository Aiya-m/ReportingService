import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import multer from "multer";
import mysql from "mysql2";
import 'dotenv/config';
import { 
    CognitoIdentityProviderClient, 
    ListUsersCommand,
    AdminEnableUserCommand,
    AdminDeleteUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

// const { uploadToS3 } = require("./s3");
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

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database!");
    connection.release();
  }
});

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});
const USER_POOL_ID = "us-east-1_4wFdFGByS";

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
