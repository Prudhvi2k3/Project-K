// models/hackathon.js
const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    oneLineDescription: {
        type: String,
        required: true,
    },
    largeDescription: {
        type: String,
        required: true,
    },
    images: [
        {
            type: Buffer,
        },
    ],
});

module.exports = mongoose.model('Hackathon', hackathonSchema);
