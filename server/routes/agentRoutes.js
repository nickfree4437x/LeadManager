const express = require('express');
const router = express.Router();
const 
{ addAgent, 
  getAllAgents, 
  deleteAgent, 
  getAgentById,
  updateAgent, 
} = require('../controllers/agentController');

// Add Agent
router.post('/add', addAgent);

// GET all agents
router.get('/', getAllAgents);

//Edit Agent
router.get('/:id', getAgentById);

// ✅ New PUT route to update agent
router.put('/:id', updateAgent);

//Delete Agent
router.delete('/:id', deleteAgent); // ✅ New delete route

module.exports = router;
