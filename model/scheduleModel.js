const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheduleModel = new Schema({
  schedule: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  user_id: {
    type: String,
  }
});
const schedule = mongoose.model("scheduleModel", scheduleModel);
module.exports = schedule;
