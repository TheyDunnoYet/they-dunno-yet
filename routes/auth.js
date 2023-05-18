const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const User = require("../models/User");

// @route   POST api/auth/register
// @desc    Register User
// @access  Private
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail({
      ignore_whitespace: false,
      normalize_email: false,
    }),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        name,
        email,
        password,
      });

      // No need to hash the password here. It will be hashed in the pre-save middleware.
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/auth/login
// @desc    Login User
// @access  Private
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail({
      ignore_whitespace: false,
      normalize_email: false,
    }),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      // console.log("User:", user);

      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      // console.log("isMatch:", isMatch);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/auth/user
// @desc    Get user profile
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/auth/user
// @desc    Edit user profile
// @access  Private
router.put("/user", auth, async (req, res) => {
  // Destructure the fields from the request body
  const {
    name,
    email,
    password,
    newPassword,
    avatar,
    about,
    twitter,
    website,
  } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verify current password if a new password is provided
    if (newPassword) {
      if (!password) {
        return res
          .status(400)
          .json({ msg: "Current password is required to set a new password" });
      }

      // Check if newPassword meets requirements
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ msg: "New password must be at least 6 characters long" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update the other fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (about) user.about = about;
    if (twitter) user.twitter = twitter;
    if (website) user.website = website;

    // Save the updated user
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/auth/user/:userId
// @desc    Delete user profile
// @access  Private
router.delete("/user/:userId", auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    const requestingUser = await User.findById(req.user.id);

    // Allow deletion if the requesting user is the target user or if they're an admin
    if (
      requestingUser.id === targetUser.id ||
      requestingUser.role === "Admin"
    ) {
      await User.findByIdAndRemove(req.params.userId);
      res.json({ msg: "User deleted" });
    } else {
      res.status(403).json({ msg: "Unauthorized" });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "User not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   GET api/auth/users
// @desc    Get all users
// @access  Private
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
