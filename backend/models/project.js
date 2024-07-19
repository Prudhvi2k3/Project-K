// models/project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    oneLineDescription: {
        type: String,
        required: true
    },
    largeDescription: {
        type: String,
        required: true
    },
    images: {
        type: [Buffer],
        required: true
    }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;