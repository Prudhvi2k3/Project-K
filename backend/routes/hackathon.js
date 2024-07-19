const express = require('express');
const Hackathon = require('../models/hackathon');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage })

// Create a new hackathon
router.post('/', upload.array('images', 10), async (req, res) => {
    const { title, oneLineDescription, largeDescription } = req.body;
    const images = req.files.map(file => file.buffer);

    try {
        const hackathon = new Hackathon({
            title,
            oneLineDescription,
            largeDescription,
            images
        });
        await hackathon.save();
        res.status(201).send(hackathon);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

// Get all hackathons
router.get('/', async (req, res) => {
    try {
        const hackathons = await Hackathon.find({});
        res.status(200).send(hackathons);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update a hackathon
router.put('/:id', upload.array('images', 10), async (req, res) => {
    const { id } = req.params;
    const { title, oneLineDescription, largeDescription } = req.body;
    const images = req.files ? req.files.map(file => file.buffer) : undefined;

    try {
        const updateData = { title, oneLineDescription, largeDescription };
        if (images) {
            updateData.images = images;
        }
        const hackathon = await Hackathon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!hackathon) {
            return res.status(404).send('Hackathon not found');
        }
        res.status(200).send(hackathon);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a hackathon
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const hackathon = await Hackathon.findByIdAndDelete(id);
        if (!hackathon) {
            return res.status(404).send('Hackathon not found');
        }
        res.status(200).send(hackathon);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;