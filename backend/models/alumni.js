const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    github: { type: String, required: true },
    linkedin: { type: String, required: true },
    email: { type: String, required: true },
    photo: { type: Buffer, required: true },
    batchName: { type: String, required: true }
});

const Alumni = mongoose.model('Alumni', AlumniSchema);

module.exports = Alumni;
