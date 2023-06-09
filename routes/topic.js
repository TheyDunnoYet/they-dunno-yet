const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Topic = require("../models/Topic");

// @route   POST api/topic
// @desc    Add new topic
// @access  Private
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

    const { name, description, feed } = req.body;

    try {
      const newTopic = new Topic({
        name,
        description,
        feed,
      });

      const topic = await newTopic.save();

      // Emit 'topicCreated' event
      req.io.emit("topicCreated", topic);

      res.json(topic);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/topic
// @desc    Get all topics
// @access  Public
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find().sort({ date: -1 });
    res.json(topics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/topic/:id
// @desc    Get topic by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ msg: "Topic not found" });
    }

    res.json(topic);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Topic not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route   PUT api/topic/:id
// @desc    Update topic
// @access  Private
router.put("/:id", auth, admin, async (req, res) => {
  const { name, description, feed } = req.body;

  // Build topic object
  const topicFields = {};
  if (name) topicFields.name = name;
  if (description) topicFields.description = description;
  if (feed) topicFields.feed = feed;

  try {
    let topic = await Topic.findById(req.params.id);

    if (!topic) return res.status(404).json({ msg: "Topic not found" });

    topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { $set: topicFields },
      { new: true }
    );

    // Emit 'topicUpdated' event
    req.io.emit("topicUpdated", topic);

    res.json(topic);
  } catch (err) {
    console.error(er.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/topic/:id
// @desc    Delete topic
// @access  Private
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    let topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ msg: "Topic not found" });
    }

    await Topic.findByIdAndRemove(req.params.id);

    // Emit 'topicDeleted' event
    req.io.emit("topicDeleted", feed);

    res.json({ msg: "Topic removed" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Topic not found" });
    }

    res.status(500).send("Server Error");
  }
});

module.exports = router;
