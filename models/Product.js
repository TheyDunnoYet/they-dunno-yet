const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  images: [String],
  title: {
    type: String,
    required: true,
  },
  tagline: String,
  description: String,
  tags: [String],
  url: String,
  dropDate: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
  upvotes: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  ],
});

module.exports = mongoose.model("Product", ProductSchema);
