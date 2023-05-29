const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Product = require("../models/Product");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Blockchain = require("../models/Blockchain");
const Marketplace = require("../models/Marketplace");
// const upload = require("../middleware/upload");

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
      check(
        "blockchain",
        "Blockchain is required and must be valid id"
      ).isMongoId(),
      check("marketplace", "Marketplace must be valid id if provided")
        .optional()
        .isMongoId(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      tagline,
      description,
      tags,
      url,
      dropDate,
      topic,
      feed,
      blockchain,
      marketplace,
      image,
    } = req.body;

    // Check if the 'tags' field is a string and parse it back into an object
    let parsedTags;
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (err) {
        return res.status(400).json({ errors: ["Invalid tags format"] });
      }
    } else {
      parsedTags = tags;
    }

    let images = image ? [image] : [];

    try {
      // Check if the provided blockchain id exists
      const blockchainExists = await Blockchain.findById(blockchain);
      if (!blockchainExists) {
        return res.status(400).json({ msg: "Invalid blockchain id" });
      }

      // Check if the provided marketplace id exists
      if (marketplace) {
        const marketplaceExists = await Marketplace.findById(marketplace);
        if (!marketplaceExists) {
          return res.status(400).json({ msg: "Invalid marketplace id" });
        }
      }

      const newProduct = new Product({
        images,
        title,
        tagline,
        description,
        tags: parsedTags,
        url,
        dropDate,
        user: req.user.id,
        topic,
        feed,
        blockchain,
        marketplace,
      });

      const product = await newProduct.save();

      // Emit 'productCreated' event
      req.io.emit("productCreated", product);

      res.json(product);
    } catch (err) {
      console.error(err.message);

      res.status(500).send("Server Error");
    }
  }
);

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
  const {
    images,
    title,
    tagline,
    description,
    tags,
    url,
    dropDate,
    topic,
    feed,
    blockchain,
    marketplace,
  } = req.body;

  const productFields = {};
  if (images) productFields.images = images;
  if (title) productFields.title = title;
  if (tagline) productFields.tagline = tagline;
  if (description) productFields.description = description;
  if (tags) productFields.tags = tags;
  if (url) productFields.url = url;
  if (dropDate) productFields.dropDate = dropDate;
  if (topic) productFields.topic = topic;
  if (feed) productFields.feed = feed;
  if (blockchain) productFields.blockchain = blockchain;
  if (marketplace) productFields.marketplace = marketplace;

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

    req.io.emit("productUpdated", product);

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

    // Emit 'productDeleted' event
    req.io.emit("productDeleted", product);

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
