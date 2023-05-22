const mongoose = require("mongoose");

const BlockchainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  acronym: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Blockchain", BlockchainSchema);
