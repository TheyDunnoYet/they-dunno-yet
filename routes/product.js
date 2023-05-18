const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Product = require("../models/Product");
const User = require("../models/User");
const Comment = require("../models/Comment");

// @route   POST api/product
// @desc    Add new product
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("url", "URL is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { images, title, tagline, description, tags, url, dropDate, topic } =
      req.body;

    try {
      const newProduct = new Product({
        images,
        title,
        tagline,
        description,
        tags,
        url,
        dropDate,
        user: req.user.id,
        topic,
      });

      const product = await newProduct.save();

      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/product
// @desc    Get all products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/products/upvote/:id
// @desc    Upvote a product
// @access  Private
router.put("/upvote/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.upvotes.includes(req.user.id)) {
      return res.status(400).json({ msg: "Product already upvoted" });
    }

    product.upvotes.unshift(req.user.id);

    await product.save();

    // Add the upvoted product to the user's upvotedProducts array
    const user = await User.findById(req.user.id);
    user.upvotedProducts.unshift(product.id);
    await user.save();

    res.json(product.upvotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/products/downvote/:id
// @desc    Downvote a product (remove upvote)
// @access  Private
router.put("/downvote/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const removeIndex = product.upvotes.indexOf(req.user.id);

    if (removeIndex === -1) {
      return res.status(400).json({ msg: "Product has not been upvoted yet" });
    }

    product.upvotes.splice(removeIndex, 1);

    await product.save();

    // Remove the upvoted product from the user's upvotedProducts array
    const user = await User.findById(req.user.id);
    const removeUserIndex = user.upvotedProducts.indexOf(product.id);
    user.upvotedProducts.splice(removeUserIndex, 1);
    await user.save();

    res.json(product.upvotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/product/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route   PUT api/product/:id
// @desc    Update product
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { images, title, tagline, description, tags, url, dropDate, topic } =
    req.body;

  // Build product object
  const productFields = {};
  if (images) productFields.images = images;
  if (title) productFields.title = title;
  if (tagline) productFields.tagline = tagline;
  if (description) productFields.description = description;
  if (tags) productFields.tags = tags;
  if (url) productFields.url = url;
  if (dropDate) productFields.dropDate = dropDate;
  if (topic) productFields.topic = topic;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Make sure user owns the product
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(er.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/product/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check if user is the product owner or an admin
    if (product.user.toString() !== req.user.id && user.role !== "Admin") {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Delete related comments
    await Comment.deleteMany({ product: req.params.id });

    await Product.deleteOne({ _id: req.params.id });

    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
