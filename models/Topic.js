const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  feed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feed",
  },
});

module.exports = mongoose.model("Topic", TopicSchema);
