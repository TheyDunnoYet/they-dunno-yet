const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const User = require("../models/User");
const Comment = require("../models/Comment");

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
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d\s:])([^\s]){8,}$/),
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

    const { email, password, stayLogged } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid email" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid password" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const expiresIn = stayLogged ? "30d" : "24h"; // 30 days if stayLogged is true, 24 hours otherwise

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn,
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
    const targetUserId = req.params.userId;
    const requestingUser = await User.findById(req.user.id);

    // Allow deletion if the requesting user is the target user or if they're an admin
    if (requestingUser.id === targetUserId || requestingUser.role === "Admin") {
      const targetUser = await User.findById(targetUserId);

      if (!targetUser) {
        return res.status(404).json({ msg: "User not found" });
      }

      const usersToUpdate = await User.find({
        $or: [
          { "following.user": targetUserId },
          { "followers.user": targetUserId },
        ],
      });

      for (let user of usersToUpdate) {
        // Remove the targetUser from following and followers lists
        user.following = user.following.filter(
          ({ user }) => user.toString() !== targetUserId
        );
        user.followers = user.followers.filter(
          ({ user }) => user.toString() !== targetUserId
        );
        await user.save();
      }

      // Delete all comments made by the target user
      await Comment.deleteMany({ user: targetUserId });

      // Now delete the target user
      await User.deleteOne({ _id: targetUserId });

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

// @route   PUT api/users/follow/:id
// @desc    Follow a user
// @access  Private
router.put("/follow/:id", auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the user is already being followed
    if (
      userToFollow.followers.filter(
        (follower) => follower.user.toString() === req.user.id
      ).length > 0
    ) {
      return res.status(400).json({ msg: "User already followed" });
    }

    // Add user to following of currentUser
    currentUser.following.unshift({ user: req.params.id });
    await currentUser.save();

    // Add currentUser to followers of userToFollow
    userToFollow.followers.unshift({ user: req.user.id });
    await userToFollow.save();

    res.json(userToFollow.followers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/users/unfollow/:id
// @desc    Unfollow a user
// @access  Private
router.put("/unfollow/:id", auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Get remove index for current user's following
    const removeIndexFollowing = currentUser.following
      .map((follow) => follow.user.toString())
      .indexOf(req.params.id);

    // Get remove index for userToUnfollow's followers
    const removeIndexFollowers = userToUnfollow.followers
      .map((follow) => follow.user.toString())
      .indexOf(req.user.id);

    if (removeIndexFollowing === -1 || removeIndexFollowers === -1) {
      return res.status(400).json({ msg: "User has not been followed yet" });
    }

    // Splice them out of the array
    currentUser.following.splice(removeIndexFollowing, 1);
    userToUnfollow.followers.splice(removeIndexFollowers, 1);

    // Save users
    await currentUser.save();
    await userToUnfollow.save();

    res.json(userToUnfollow.followers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/users/followers/:id
// @desc    Get followers of a user
// @access  Public
router.get("/followers/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers.user", [
      "name",
    ]);
    res.json(user.followers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/users/following/:id
// @desc    Get users that a user is following
// @access  Public
router.get("/following/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following.user", [
      "name",
    ]);
    res.json(user.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
