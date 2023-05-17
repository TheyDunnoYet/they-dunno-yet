const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Tag = require("../models/Tag");

// @route   POST api/tag
// @desc    Add new tag
// @access  Private
router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  admin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      const newTag = new Tag({
        name,
      });

      const tag = await newTag.save();

      res.json(tag);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/tag
// @desc    Get all tags
// @access  Public
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find().sort({ date: -1 });
    res.json(tags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/tag/:id
// @desc    Delete tag
// @access  Private
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    let tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ msg: "Tag not found" });
    }

    await Tag.findByIdAndRemove(req.params.id);

    res.json({ msg: "Tag removed" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Tag not found" });
    }

    res.status(500).send("Server Error");
  }
});

module.exports = router;
