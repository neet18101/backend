const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const adminModel = new Schema({
  email: {
    unique: true, // `email` must be unique
    type: String,
  },
  password: String,
  date: { type: Date, default: Date.now },
  is_active: { type: Number, default: 1 },
});

const Admin = mongoose.model("adminModels", adminModel);
module.exports = Admin;
