const mongoose = require("mongoose");
const { Schema } = mongoose;

const propertyDetailSchema = new Schema({
  propertyData: Object,
  localityDetails: Object,
  rentalDetail: Object,
  amenities: Object,
  scheduleVisit: Object,
  gallery: [{ type: Schema.Types.ObjectId, ref: "galleryModal" }],
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  handPicked: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Number,
    default: 1,
  },
  date_time: {
    type: Date,
    default: Date.now,
  },
});

const PropertyDetail = mongoose.model("PropertyDetail", propertyDetailSchema);
module.exports = PropertyDetail;
