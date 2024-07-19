const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoGallerySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  images: [
    {
      type: Buffer,
      required: true
    }
  ]
});

module.exports = mongoose.model('PhotoGallery', photoGallerySchema);