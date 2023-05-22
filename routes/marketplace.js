const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const Marketplace = require("../models/Marketplace");
const Blockchain = require("../models/Blockchain");

// GET All Marketplaces
router.get("/", async (req, res) => {
  try {
    const marketplaces = await Marketplace.find().sort({ date: -1 });
    res.json(marketplaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET a specific marketplace
router.get("/:id", async (req, res) => {
  try {
    const marketplace = await Marketplace.findById(req.params.id);
    if (!marketplace) {
      return res.status(404).json({ msg: "Marketplace not found" });
    }
    res.json(marketplace);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Marketplace not found" });
    }
    res.status(500).send("Server error");
  }
});

// POST a new marketplace
router.post(
  "/",
  auth,
  admin,
  [
    check("name", "Name is required").not().isEmpty(),
    check("acronym", "Acronym is required").not().isEmpty(),
    check(
      "blockchain",
      "Blockchain is required and must be valid id"
    ).isMongoId(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, acronym, blockchain } = req.body;

    try {
      // Check if the provided blockchain id exists
      const blockchainExists = await Blockchain.findById(blockchain);
      if (!blockchainExists) {
        return res.status(400).json({ msg: "Invalid blockchain id" });
      }

      const newMarketplace = new Marketplace({
        name,
        acronym,
        blockchain,
      });

      const marketplace = await newMarketplace.save();

      // Emit 'marketplaceCreated' event
      req.io.emit("marketplaceCreated", marketplace);

      res.json(marketplace);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// PUT to update a marketplace
router.put("/:id", auth, admin, async (req, res) => {
  const { name, acronym, blockchain } = req.body;

  const marketplaceFields = {};
  if (name) marketplaceFields.name = name;
  if (acronym) marketplaceFields.acronym = acronym;
  if (blockchain) marketplaceFields.blockchain = blockchain;

  try {
    let marketplace = await Marketplace.findById(req.params.id);

    if (!marketplace)
      return res.status(404).json({ msg: "Marketplace not found" });

    marketplace = await Marketplace.findByIdAndUpdate(
      req.params.id,
      { $set: marketplaceFields },
      { new: true }
    );

    // Emit 'marketplaceUpdated' event
    req.io.emit("marketplaceUpdated", marketplace);

    res.json(marketplace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE a marketplace
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    let marketplace = await Marketplace.findById(req.params.id);

    if (!marketplace)
      return res.status(404).json({ msg: "Marketplace not found" });

    await Marketplace.findByIdAndRemove(req.params.id);

    // Emit 'marketplaceDeleted' event
    req.io.emit("marketplaceDeleted", marketplace);

    res.json({ msg: "Marketplace removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
