const mongoose = require("mongoose");
const { Schema } = mongoose;

const amentiesModal = new Schema({
  bathroom: { type: String, default: "" },
  balcony: { type: String, default: "" },
  waterSupply: { type: String, default: "" },
  gym: { type: String, default: "" },
  nonVeg: { type: String, default: "" },
  gatedSecurity: { type: String, default: "" },
  smoking: { type: String, default: "" },
  propertyAvailable: { type: String, default: "" },
  secondaryNumber: { type: String, default: "" },
  anyDirection: { type: String, default: "" },

  user_id: {
    type: Schema.Types.ObjectId,
  },
  is_active: {
    type: Number,
    default: 1,
  },
});

const amenties = mongoose.model("amentiesModal", amentiesModal);
module.exports = amenties;
