const mongoose = require("mongoose");

const MarketplaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  acronym: {
    type: String,
    required: true,
  },
  blockchain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blockchain",
  },
});

module.exports = mongoose.model("Marketplace", MarketplaceSchema);
