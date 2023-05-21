const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const Feed = require("../models/Feed");
const User = require("../models/User");

// GET All Feeds
router.get("/", async (req, res) => {
  try {
    const feeds = await Feed.find().sort({ date: -1 });
    res.json(feeds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/feed/:id
// @desc    Get a specific feed
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id);
    if (!feed) {
      return res.status(404).json({ msg: "Feed not found" });
    }
    res.json(feed);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Feed not found" });
    }
    res.status(500).send("Server error");
  }
});

// POST a New Feed
// route protected by auth middleware
router.post(
  "/",
  auth,
  admin,
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
      const newFeed = new Feed({
        name,
        description,
      });

      const feed = await newFeed.save();

      // Emit 'feedCreated' event
      req.io.emit("feedCreated", feed);

      res.json(feed);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// PUT to Update a Feed
// route protected by auth middleware
router.put("/:id", auth, admin, async (req, res) => {
  const { name, description } = req.body;

  const feedFields = {};
  if (name) feedFields.name = name;
  if (description) feedFields.description = description;

  try {
    let feed = await Feed.findById(req.params.id);

    if (!feed) return res.status(404).json({ msg: "Feed not found" });

    feed = await Feed.findByIdAndUpdate(
      req.params.id,
      { $set: feedFields },
      { new: true }
    );

    // Emit 'feedUpdated' event
    req.io.emit("feedUpdated", feed);

    res.json(feed);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE a Feed
// route protected by auth middleware
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    let feed = await Feed.findById(req.params.id);

    if (!feed) return res.status(404).json({ msg: "Feed not found" });

    await Feed.findByIdAndRemove(req.params.id);

    // Emit 'feedDeleted' event
    req.io.emit("feedDeleted", feed);

    res.json({ msg: "Feed removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
