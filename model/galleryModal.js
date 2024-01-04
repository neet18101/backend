const mongoose = require("mongoose");
const { Schema } = mongoose;

const galleryModal = new Schema({
  image: {
    type: String,
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
  user_id: {
    type: String,
  }
});

const gallery = mongoose.model("galleryModal", galleryModal);
module.exports = gallery;