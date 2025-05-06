const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  // description: { type: String },
  filename: {
    type: String,
    required: true,
  }, // Имя файла в 'media'
  path: {
    type: String,
    required: true,
  }, // Полный путь к файлу
  // size: { type: Number, required: true },
  mimetype: {
    type: String,
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listens: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Media", mediaSchema);
