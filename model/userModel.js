const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userModel = new Schema({
  name: {
    type: String,
  },
  email: {
    unique: true, // `email` must be unique
    type: String,
    require: true,
  },
  phonenumber: {
    type: String,
    require: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); // Example: requires exactly 10 digits
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    require: true,
  },
  is_verified: {
    type: Number,
    default: 0,
  },
  subscription: {
    type: Number,
    default: 0,
  },
  userType: {
    type: Number,
    default: 1,
  },
  userFor: {
    type: String,
  },
  propertyType: {
    type: String,
  },
  date: { type: Date, default: Date.now },
  is_active: { type: Number, default: 1 },
});

// Password hashing middleware
userModel.pre("save", async function (next) {
  const user = this;

  // Hash the password only if it's modified (or is new)
  if (!user.isModified("password")) return next();

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    // Replace the plaintext password with the hashed one
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model("users", userModel);
module.exports = User;
