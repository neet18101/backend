const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define PropertyData schema
const propertyDataSchema = new Schema({
  apartmentName: String,
  bhkType: String,
  totalFloor: String,
  floor: String,
  propertyAge: String,
  facing: String,
  builtUpArea: String,
  user_id: String,
  apartmentType: String,
  universty: String,
});

// Define LocalityDetails schema
const localityDetailsSchema = new Schema({
  city: String,
  locality: String,
  landmark: String,
  user_id: String,
});

// Define RentalDetail schema
const rentalDetailSchema = new Schema({
  propertyAvailable: String,
  expectRent: String,
  expectedDeposite: String,
  rentNegotial: String,
  monthlyMaintenance: String,
  availableFrom: Date,
  preferredTenant: String,
  furnishing: String,
  parking: String,
  user_id: String,
});

// Define Amenities schema
const amenitiesSchema = new Schema({
  bathroom: Number,
  balcony: Number,
  waterSupply: String,
  gym: String,
  non_veg: String,
  gated_security: String,
  smoking: String,
  property_available: String,
  seconderyNumber: String,
  anyDirection: String,
  user_id: String,
});

// Define ScheduleVisit schema
const scheduleVisitSchema = new Schema({
  availability: String,
  starttime: String,
  endtime: String,
  user_id: String,
});

// Define main PropertyDetail schema combining all sub-schemas
const propertyDetailSchema = new Schema({
  propertyData: propertyDataSchema,
  property_url: String,
  localityDetails: localityDetailsSchema,
  rentalDetail: rentalDetailSchema,
  amenities: amenitiesSchema,
  gallery: [{ type: Schema.Types.ObjectId, ref: "galleryModal" }],
  scheduleVisit: scheduleVisitSchema,
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

// Create and export the model based on the schema
const PropertyDetail = mongoose.model("PropertyDetail", propertyDetailSchema);

module.exports = PropertyDetail;
