const User = require("../models/User");

const admin = async (req, res, next) => {
  try {
    // Get user from the database
    const user = await User.findById(req.user.id);

    // Check if user is an admin
    if (user.role !== "Admin") {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = admin;
