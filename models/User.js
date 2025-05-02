const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: { type: String, enum: ["admin", "user", "guest"], default: "guest" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
