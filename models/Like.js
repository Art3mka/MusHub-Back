const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaId: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Like", likeSchema);
