const mongoose = require("mongoose");
const { Schema } = mongoose;
const propertyDetail = new Schema({
  apartmentType: {
    type: String,
  },
  bhkType: {
    type: String,
  },
  ownerName: {
    type: String,
  },
  email: {
    type: String,
  },
  builtUpArea: {
    type: String,
  },
  facing: {
    type: String,
  },
  floor: {
    type: String,
  },
  propertyAge: {
    type: String,
  },
  totalFloor: {
    type: Number,
  },
  user_id: {
    type: Schema.Types.ObjectId,
  },
  is_active: {
    type: Number,
    default: 1,
  },
});

const propertyDetails = mongoose.model("propertyModel", propertyDetail);
module.exports = propertyDetails;
