const mongoose = require("mongoose");
const { Schema } = mongoose;

const listModal = new Schema({
  owner_name: {
    type: String,
    require: true,
  },
  appartment_type: {
    type: String,
    require: true,
  },
  appartment_name: {
    type: String,
    require: true,
  },
  bhk_type: {
    type: String,
    require: true,
  },
  total_floor: {
    type: Number,
    require: true,
  },
  floor: {
    type: Number,
    require: true,
  },
  property_age: {
    type: String,
    require: true,
  },
  facing: {
    type: String,
    require: true,
  },
  builtuparea: {
    type: Number,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  locality: {
    type: String,
    require: true,
  },
  landmark: {
    type: String,
    require: true,
  },
  property_available_for: {
    type: String,
    require: true,
  },
  expected_rent: {
    type: Number,
    require: true,
  },
  expected_depost: {
    type: Number,
    require: true,
  },
  monthly_maintance: {
    type: String,
    require: true,
  },
  available_from: {
    type: Number,
    require: true,
  },
  preferred_tennats: {
    type: String,
    require: true,
  },
  fursing: {
    type: String,
    require: true,
  },
  parking: {
    type: String,
    require: true,
  },
  descripition: {
    type: String,
    require: true,
  },
  amenties: {
    type: Object,
    require: true,
  },
  image: {
    type: object,
    require: true,
  },
  video: {
    type: object,
    require: true,
  },
  availability: {
    type: String,
    require: true,
  },
  start_time: {
    type: String,
    require: true,
  },
  end_time: {
    type: String,
    require: true,
  },
  agree: {
    type: String,
    require: true,
  },
  user_id: {
    type: String,
    require: true,
  },
  date: { type: Date, default: Date.now },
  is_active: { type: Number, default: 1 },
});

const ListModal = mongoose.model("listModals", listModal);
module.exports = ListModal;
