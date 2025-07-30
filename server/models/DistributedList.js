const mongoose = require("mongoose");

const distributedListSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    data: [
      {
        FirstName: String,
        Phone: String,
        Notes: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DistributedList", distributedListSchema);
