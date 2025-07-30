const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes');
const uploadRoutes = require("./routes/uploadRoutes");
const distributedRoutes = require("./routes/distributedRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.use('/api', authRoutes);
app.use('/api/agents', agentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/distributed", distributedRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
