const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Achievement = require('../models/achievement');

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Achievement routes

// Create a new achievement
router.post('/', upload.single('image'), async (req, res) => {
    const { title, number } = req.body;
    const image = req.file ? req.file.buffer : null;

    try {
        if (!image) {
            return res.status(400).send('Image is required');
        }

        const achievement = new Achievement({
            title,
            number,
            image
        });
        await achievement.save();
        res.status(201).send(achievement);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

// Get all achievements
router.get('/', async (req, res) => {
    try {
        const achievements = await Achievement.find({});
        res.status(200).send(achievements);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update an achievement
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, number } = req.body;
    const image = req.file ? req.file.buffer : null;

    try {
        const updateData = { title, number };
        if (image) {
            updateData.image = image;
        }

        const achievement = await Achievement.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!achievement) {
            return res.status(404).send();
        }
        res.status(200).send(achievement);
    } catch (error) {
        console.error('Error updating achievement:', error);
        res.status(400).send({ message: 'Error updating achievement' });
    }
});

// Delete an achievement
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const achievement = await Achievement.findByIdAndDelete(id);
        if (!achievement) {
            return res.status(404).send();
        }
        res.status(200).send(achievement);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;