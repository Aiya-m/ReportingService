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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
