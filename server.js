const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = 3000;

const votesFile = path.join(__dirname, "votes.json");

app.use(express.json());
app.use(express.static("public"));
app.use(cors({ origin: "https://akanksha-campaign-frontend.vercel.app" }));

// Get current vote count
app.get("/api/votes", (req, res) => {
  const data = JSON.parse(fs.readFileSync(votesFile));
  res.json({ count: data.count });
});

// Handle a vote
app.post("/api/vote", (req, res) => {
  const deviceId = req.body.deviceId;
  if (!deviceId) return res.status(400).send("Missing deviceId");

  const data = JSON.parse(fs.readFileSync(votesFile));

  if (data.votedDevices.includes(deviceId)) {
    return res.status(403).send("Already voted");
  }

  data.count += 1;
  data.votedDevices.push(deviceId);

  fs.writeFileSync(votesFile, JSON.stringify(data, null, 2));
  res.json({ success: true, newCount: data.count });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

