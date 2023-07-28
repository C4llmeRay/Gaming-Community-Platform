const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
