const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Product = require("../models/Product");

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
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Make sure user owns the product
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Product.findByIdAndRemove(req.params.id);

    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(500).send("Server Error");
  }
});

module.exports = router;
