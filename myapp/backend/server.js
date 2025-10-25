const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from backend 🚀");
});

app.get("/api", (req, res) => {
  res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.get("/caution_position", (req, res) => {    
  res.json({"locations": [[100.7887341, 13.7348824], [98.9792, 18.7961], [102.839, 16.4419]]})
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
