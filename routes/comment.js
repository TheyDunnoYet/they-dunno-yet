const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const Comment = require("../models/Comment");
const User = require("../models/User");
const Product = require("../models/Product");

// @route   POST api/comment
// @desc    Create a comment on a product
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required").not().isEmpty(),
      check("product", "Product is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const product = await Product.findById(req.body.product);

      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }

      const newComment = new Comment({
        text: req.body.text,
        product: req.body.product,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });

      const comment = await newComment.save();

      res.json(comment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/comment
// @desc    Get all comments
// @access  Public
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/comment/:id
// @desc    Get a comment
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/comment/:id
// @desc    Update a comment
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // Make sure the comment belongs to the user updating it
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const { text } = req.body;
    if (text) comment.text = text;

    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/comment/:id
// @desc    Delete a comment
// @access  Private/Admin
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // Check if user is the comment owner or an admin
    if (comment.user.toString() !== req.user.id && user.role !== "Admin") {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Comment.deleteOne({ _id: req.params.id });

    res.json({ msg: "Comment removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Comment not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   GET api/comment/product/:product_id
// @desc    Get all comments for a product
// @access  Public
router.get("/product/:product_id", async (req, res) => {
  try {
    const comments = await Comment.find({
      product: req.params.product_id,
    }).sort({ date: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
