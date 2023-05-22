const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const Blockchain = require("../models/Blockchain");
const User = require("../models/User");

// GET All Blockchains
router.get("/", async (req, res) => {
  try {
    const blockchains = await Blockchain.find().sort({ date: -1 });
    res.json(blockchains);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/blockchain/:id
// @desc    Get a specific blockchain
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const blockchain = await Blockchain.findById(req.params.id);
    if (!blockchain) {
      return res.status(404).json({ msg: "Blockchain not found" });
    }
    res.json(blockchain);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Blockchain not found" });
    }
    res.status(500).send("Server error");
  }
});

// POST a New Blockchain
// route protected by auth middleware
router.post(
  "/",
  auth,
  admin,
  [
    check("name", "Name is required").not().isEmpty(),
    check("acronym", "Acronym is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, acronym } = req.body;

    try {
      const newBlockchain = new Blockchain({
        name,
        acronym,
      });

      const blockchain = await newBlockchain.save();

      // Emit 'blockchainCreated' event
      req.io.emit("blockchainCreated", blockchain);

      res.json(blockchain);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// PUT to Update a Blockchain
// route protected by auth middleware
router.put("/:id", auth, admin, async (req, res) => {
  const { name, acronym } = req.body;

  const blockchainFields = {};
  if (name) blockchainFields.name = name;
  if (acronym) blockchainFields.acronym = acronym;

  try {
    let blockchain = await Blockchain.findById(req.params.id);

    if (!blockchain)
      return res.status(404).json({ msg: "Blockchain not found" });

    blockchain = await Blockchain.findByIdAndUpdate(
      req.params.id,
      { $set: blockchainFields },
      { new: true }
    );

    // Emit 'blockchainUpdated' event
    req.io.emit("blockchainUpdated", blockchain);

    res.json(blockchain);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE a Blockchain
// route protected by auth middleware
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    let blockchain = await Blockchain.findById(req.params.id);

    if (!blockchain)
      return res.status(404).json({ msg: "Blockchain not found" });

    await Blockchain.findByIdAndRemove(req.params.id);

    // Emit 'blockchainDeleted' event
    req.io.emit("blockchainDeleted", blockchain);

    res.json({ msg: "Blockchain removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
