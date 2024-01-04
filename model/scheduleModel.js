const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheduleModel = new Schema({
  availability: {
    type: String,
  },
  starttime: {
    type: String,
  },
  endtime: {
    type: String,
  },
  user_id: {
    type: String,
  },
  is_active: {
    type: Number,
    default: 1,
  },
});
const schedule = mongoose.model("scheduleModel", scheduleModel);
module.exports = schedule;
