const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

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

// POST a New Feed
// route protected by auth middleware
router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newFeed = new Feed({
        name: req.body.name,
        user: req.user.id,
      });

      const feed = await newFeed.save();

      res.json(feed);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// PUT to Update a Feed
// route protected by auth middleware
router.put("/:id", auth, async (req, res) => {
  const { name } = req.body;

  const feedFields = {};
  if (name) feedFields.name = name;

  try {
    let feed = await Feed.findById(req.params.id);

    if (!feed) return res.status(404).json({ msg: "Feed not found" });

    feed = await Feed.findByIdAndUpdate(
      req.params.id,
      { $set: feedFields },
      { new: true }
    );

    res.json(feed);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE a Feed
// route protected by auth middleware
router.delete("/:id", auth, async (req, res) => {
  try {
    let feed = await Feed.findById(req.params.id);

    if (!feed) return res.status(404).json({ msg: "Feed not found" });

    await Feed.findByIdAndRemove(req.params.id);

    res.json({ msg: "Feed removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
