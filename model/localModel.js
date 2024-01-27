const mongoose = require("mongoose");
const { Schema } = mongoose;
const localModel = new Schema({
  city: {
    type: String,
  },
  locality: {
    type: String,
  },
  landmark: {
    type: String,
  },
  user_id: {
    type: Schema.Types.ObjectId,
  },
  is_active: {
    type: Number,
    default: 1,
  },
});
const loacalityDetails = mongoose.model("localModel", localModel);
module.exports = loacalityDetails;
