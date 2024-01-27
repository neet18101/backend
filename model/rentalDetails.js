const mongoose = require("mongoose");

const rentalDetails = new mongoose.Schema({
  propertyAvailable: { type: String, default: "" },
  expectRent: { type: String, default: "" },
  expectedDeposit: { type: String, default: "" },
  rentNegotiable: { type: Boolean, default: false },
  monthlyMaintenance: { type: String, default: "" },

  availableFrom: { type: Date, default: null },
  preferredTenant: { type: String, default: "" },
  furnishing: { type: String, default: "" },
  parking: { type: String, default: false },
  user_id: {
    type: mongoose.Types.ObjectId,
  },
  is_active: {
    type: Number,
    default: 1,
  },
});

const rental = mongoose.model("rentalDetails", rentalDetails);

module.exports = rental;
