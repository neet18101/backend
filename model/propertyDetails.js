const mongoose = require("mongoose");
const { Schema } = mongoose;

const propertyDetailSchema = new Schema({
  propertyData: [Object],
  localityDetails: Object,
  rentalDetail: Object,
  amenities: Object,
  gallery: [{ type: Schema.Types.ObjectId, ref: "GalleryImage" }], // Reference to gallery images
  scheduleVisit: Object,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model if available
  },
  is_active: {
    type: Number,
    default: 1,
  },
});

const PropertyDetail = mongoose.model("PropertyDetail", propertyDetailSchema);
module.exports = PropertyDetail;
