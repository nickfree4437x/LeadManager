const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  mobile: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema);
