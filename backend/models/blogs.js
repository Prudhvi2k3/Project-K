const mongoose = require('mongoose');

const blogSchemas = {
    NewsLetter: new mongoose.Schema({
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        longDescription: { type: String, required: true },
        date: { type: Date, required: true },
        files: [{ type: Buffer, required: true }]
    }),
    FMML: new mongoose.Schema({
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        longDescription: { type: String, required: true },
        date: { type: Date, required: true },
        files: [{ type: Buffer, required: true }]
    }),
    Workshops: new mongoose.Schema({
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        longDescription: { type: String, required: true },
        date: { type: Date, required: true },
        files: [{ type: Buffer, required: true }]
    }),
    Webinars: new mongoose.Schema({
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        longDescription: { type: String, required: true },
        youtubeLink: { type: String, required: true },
        date: { type: Date, required: true },
        files: [{ type: Buffer, required: true }]
    }),
    Contests: new mongoose.Schema({
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        longDescription: { type: String, required: true },
        date: { type: Date, required: true },
        files: [{ type: Buffer, required: true }]
    }),
};

const models = {};
for (const [key, schema] of Object.entries(blogSchemas)) {
    models[key] = mongoose.model(key, schema);
}

module.exports = {
    blogSchemas,
    models,
    getModel: (blogType) => models[blogType]
};