const mongoose = require("mongoose");
const { Schema } = mongoose;

const galleryModal = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  property_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  imagePaths: { type: [String], required: true },
  created_at: { type: Date, default: Date.now }, // Optional timestamp
  updated_at: { type: Date, default: Date.now }, // Optional timestamp
});

const GalleryImage = mongoose.model("galleryModal", galleryModal);
module.exports = GalleryImage;
    