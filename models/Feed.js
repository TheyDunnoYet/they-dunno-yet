const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
});

module.exports = mongoose.model("Feed", FeedSchema);
