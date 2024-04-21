const mongoose = require("mongoose");
const { Schema } = mongoose;

const pglistgalleryModal = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  pg_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  imagePaths: { type: [String], required: true },
  created_at: { type: Date, default: Date.now }, // Optional timestamp
  updated_at: { type: Date, default: Date.now }, // Optional timestamp
});

const PgListGalleryImage = mongoose.model(
  "pglistgalleryModal",
  pglistgalleryModal
);
module.exports = PgListGalleryImage;
