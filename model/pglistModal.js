const mongoose = require("mongoose");

const { Schema } = mongoose;

const amenitiesSchema = new Schema({
  laundry: String,
  roomCleaning: String,
  warden: String,
  anyTip: String,
  commonTV: Boolean,
  lift: String,
  refrigerator: String,
  mess: String,
  wifi: String,
  powerBackup: String,
  cooking: Boolean,
  parkingType: String,
  user_id: String,
});

const locationSchema = new Schema({
  city: String,
  locality: String,
  landmark: String,
});

const accommodationDetailsSchema = new Schema({
  pgName: String,
  roomType: String,
  tenant: String,
  expectedRent: String,
  expectedDeposit: String,
  closet: String,
  TV: String,
  bedding: String,
  geyser: String,
  AC: Boolean,
  attachedBathroom: String,
  table: String,
  meal: Boolean,
});

const tenantPreferencesSchema = new Schema({
  gender: String,
  preferredGuest: String,
  availableFrom: String,
  foodIncluded: String,
  breakfast: Boolean,
  lunch: Boolean,
  dinner: Boolean,
  noSmoking: Boolean,
  noGuardiansStay: Boolean,
  noDrinking: Boolean,
  noNonVeg: Boolean,
  noGirlsEntry: Boolean,
  gatedClosingTime: String,
  nearCollege: String,
  description: String,
});

const availabilitySchema = new Schema({
  availability: String,
  startTime: String,
  endTime: String,
  availableAllDay: Boolean,
});

const PglistSchema = new Schema({
  amenities: amenitiesSchema,
  location: locationSchema,
  accommodationDetails: accommodationDetailsSchema,
  tenantPreferences: tenantPreferencesSchema,
  availability: availabilitySchema,
  pg_url: String,
  gallery: [{ type: Schema.Types.ObjectId, ref: "pglistGalleryModal" }],
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
    default: Date.now(),
  },
});

const pgList = mongoose.model("Pglist", PglistSchema);

module.exports = pgList;
