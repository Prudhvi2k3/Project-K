// models/focusarea.js
const mongoose = require('mongoose');

const focusAreaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: Buffer,
        required: true
    }
});

const FocusArea = mongoose.model('FocusArea', focusAreaSchema);
module.exports = FocusArea;