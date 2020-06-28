const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const streamingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var Streamings = mongoose.model("Streamings", streamingSchema);

module.exports = Streamings;
