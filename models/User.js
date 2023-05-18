const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Learner", "Admin"],
    default: "Learner",
  },
  avatar: String,
  about: String,
  twitter: String,
  website: String,
  upvotedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  following: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  followers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre("remove", async function (next) {
  try {
    const user = this._id;

    await this.model("User").updateMany(
      {
        $or: [{ "following.user": user }, { "followers.user": user }],
      },
      {
        $pull: {
          following: { user: user },
          followers: { user: user },
        },
      },
      { multi: true } // ensure multiple documents can be updated
    );
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
