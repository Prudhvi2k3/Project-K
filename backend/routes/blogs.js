const express = require('express');
const multer = require('multer');
const moment = require('moment');
const { getModel } = require('../models/blogs');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Routes for CRUD operations
router.post('/:blogType', upload.array('files'), async (req, res) => {
    const { blogType } = req.params;
    const { title, shortDescription, longDescription, youtubeLink, date } = req.body;
    const files = req.files.map(file => file.buffer);

    const Model = getModel(blogType);

    try {
        const newBlogData = {
            title,
            shortDescription,
            longDescription,
            date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            files
        };

        if (blogType === 'Webinars') {
            newBlogData.youtubeLink = youtubeLink;
        }

        const newBlog = new Model(newBlogData);

        await newBlog.save();
        res.status(201).send('Blog uploaded successfully');
    } catch (error) {
        res.status(500).send('Error uploading blog: ' + error.message);
    }
});

router.get('/:blogType', async (req, res) => {
    const { blogType } = req.params;
    const Model = getModel(blogType);

    try {
        const blogs = await Model.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).send('Error fetching blogs: ' + error.message);
    }
});

router.put('/:blogType/:id', upload.array('files'), async (req, res) => {
    const { blogType, id } = req.params;
    const { title, shortDescription, longDescription, youtubeLink, date } = req.body;
    const files = req.files.map(file => file.buffer);

    const Model = getModel(blogType);

    try {
        const updateData = { title, shortDescription, longDescription, date };
        if (files.length > 0) {
            updateData.files = files;
        }

        if (blogType === 'Webinars') {
            updateData.youtubeLink = youtubeLink;
        }

        const updatedBlog = await Model.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBlog) {
            return res.status(404).send('Blog not found');
        }

        res.status(200).send('Blog updated successfully');
    } catch (error) {
        res.status(500).send('Error updating blog: ' + error.message);
    }
});

router.delete('/:blogType/:id', async (req, res) => {
    const { blogType, id } = req.params;
    const Model = getModel(blogType);

    try {
        const deletedBlog = await Model.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).send('Blog not found');
        }

        res.status(200).send('Blog deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting blog: ' + error.message);
    }
});

module.exports = router;