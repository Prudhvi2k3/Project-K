const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  smallDescription: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Event', eventSchema);