// projects.js

const express = require('express');
const Project = require('../models/project');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage })

router.post('/', upload.array('images', 10), async (req, res) => {
    const { title, oneLineDescription, largeDescription } = req.body;
    const images = req.files ? req.files.map(file => file.buffer) : [];

    try {
        if (images.length === 0) {
            return res.status(400).send('At least one image is required');
        }

        const project = new Project({
            title,
            oneLineDescription,
            largeDescription,
            images
        });
        await project.save();
        res.status(201).send(project);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({});
        res.status(200).send(projects);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.status(200).send(project);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/:id', upload.array('images', 10), async (req, res) => {
    const { id } = req.params;
    const { title, oneLineDescription, largeDescription } = req.body;
    const images = req.files ? req.files.map(file => file.buffer) : null;

    try {
        const updateData = { title, oneLineDescription, largeDescription };
        if (images) {
            updateData.images = images;
        }
        const project = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.status(200).send(project);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.status(200).send('Project deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

module.exports = router;