const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');

const addAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Basic validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: "Agent with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save agent
    const newAgent = new Agent({
      name,
      email,
      mobile,
      password: hashedPassword
    });

    await newAgent.save();
    res.status(201).json({ message: "Agent created successfully" });

  } catch (error) {
    console.error("Error adding agent:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (err) {
    console.error("Error fetching agents:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    await Agent.findByIdAndDelete(id);
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting agent', error: err.message });
  }
};


const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.status(200).json(agent);
  } catch (error) {
    console.error("Error fetching agent by ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAgent = await Agent.findByIdAndUpdate(id, req.body, {
      new: true, // return updated document
      runValidators: true, // validate fields
    });

    if (!updatedAgent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json(updatedAgent);
  } catch (error) {
    console.error("Error updating agent:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addAgent, getAllAgents, deleteAgent, getAgentById, updateAgent,};
