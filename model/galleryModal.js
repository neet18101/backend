const mongoose = require("mongoose");
const { Schema } = mongoose;

const galleryModal = new Schema({
  name: String,
  size: Number,
  type: String,
  data: Buffer, // Store the image data as binary
});

const GalleryImage  = mongoose.model("galleryModal", galleryModal);
module.exports = GalleryImage ;
