const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Topic = require("../models/Topic");

// @route   POST api/topic
// @desc    Create a new topic
// @access  Private
router.post(
  "/",
  auth,
  [
    check("name", "Topic name is required").not().isEmpty(),
    check("description", "Topic description is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
      let topic = new Topic({
        user: req.user.id,
        name,
        description,
      });

      await topic.save();

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
router.put(
  "/:id",
  auth,
  [
    check("name", "Topic name is required").not().isEmpty(),
    check("description", "Topic description is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
      let topic = await Topic.findById(req.params.id);

      if (!topic) {
        return res.status(404).json({ msg: "Topic not found" });
      }

      // Make sure user owns the topic
      if (topic.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not authorized" });
      }

      topic = await Topic.findByIdAndUpdate(
        req.params.id,
        { $set: { name, description } },
        { new: true }
      );

      res.json(topic);
    } catch (err) {
      console.error(err.message);

      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Topic not found" });
      }

      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/topic/:id
// @desc    Delete topic
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ msg: "Topic not found" });
    }

    // Make sure user owns the topic
    if (topic.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Topic.findByIdAndRemove(req.params.id);

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
