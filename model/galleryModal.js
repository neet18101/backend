const mongoose = require("mongoose");
const { Schema } = mongoose;

const galleryModal = new Schema({
  filename: {
    type: Array,
    required: true,
  },
  path: {
    type: String,
  },
  video: {
    type: String,
  },
  user_id: {
    type: Schema.Types.ObjectId,
  },
  is_active: {
    type: Number,
    default: 1,
  },
});

const gallery = mongoose.model("galleryModal", galleryModal);
module.exports = gallery;
