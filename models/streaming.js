const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const streamingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    authour: { type: String, required: true },

    description: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
    },

    Type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

var Streamings = mongoose.model("Streamings", streamingSchema);

module.exports = Streamings;
