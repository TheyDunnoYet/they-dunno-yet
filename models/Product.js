const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  images: [String],
  title: {
    type: String,
    required: true,
  },
  tagline: String,
  description: String,
  tags: {
    type: {
      feed: {
        type: { _id: String, name: String, acronym: String },
      },
      topic: {
        type: { _id: String, name: String, acronym: String },
      },
      blockchain: {
        type: { _id: String, name: String, acronym: String },
      },
      marketplace: {
        type: { _id: String, name: String, acronym: String },
      },
    },
    default: {},
  },
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
  feed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feed",
  },
  upvotes: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  ],
  blockchain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blockchain",
    required: true,
  },
  marketplace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Marketplace",
  },
});

module.exports = mongoose.model("Product", ProductSchema);
