const mongoose = require("mongoose");
const { Schema } = mongoose;

const galleryModal = new Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  video: {
    type: String,
  },
  user_id: {
    type: String,
  },
  is_active: {
    type: Number,
    default: 1,
  },

});

const gallery = mongoose.model("galleryModal", galleryModal);
module.exports = gallery;
