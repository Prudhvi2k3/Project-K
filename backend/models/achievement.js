// models/achievement.js
const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: Number,
        required: true
    },
    image: { 
        type: Buffer, 
        required: false
    }
});

module.exports = mongoose.model('Achievement', achievementSchema);