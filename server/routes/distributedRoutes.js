const express = require("express");
const router = express.Router();
const DistributedList = require("../models/DistributedList");
const Agent = require("../models/Agent");

// GET /api/distributed
router.get("/", async (req, res) => {
  try {
    const data = await DistributedList.find().populate("agentId");
    res.json(data);
  } catch (err) {
    console.error("Fetch distributed data error:", err);
    res.status(500).json({ error: "Failed to fetch distributed data." });
  }
});

module.exports = router;
