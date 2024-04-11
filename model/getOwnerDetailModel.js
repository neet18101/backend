const mongoose = require("mongoose");
const { Schema } = mongoose;
const getOwnerDetails = new Schema({
  property_url: {
    type: String,
    require: true,
  },
  property_id: {
    type: String,
    require: true,
  },
  user_id: {
    type: String,
    require: true,
  },
  is_active: {
    type: Number,
    default: 1,
  },
  date_time: {
    type: Date,
    default: Date.now(),
  },
});

const ownerDetails = mongoose.model("getOwnerDetails", getOwnerDetails);
module.exports = ownerDetails;
