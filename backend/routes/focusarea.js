const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const FocusArea = require('../models/focusarea');

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to get a focus area by ID
async function getFocusArea(req, res, next) {
    let focusArea;
    try {
        focusArea = await FocusArea.findById(req.params.id);
        if (focusArea == null) {
            return res.status(404).json({ message: 'Cannot find focus area' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.focusArea = focusArea;
    next();
}

// Get all focus areas
router.get('/', async (req, res) => {
    try {
        const focusAreas = await FocusArea.find();
        res.json(focusAreas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one focus area
router.get('/:id', getFocusArea, (req, res) => {
    res.json(res.focusArea);
});

// Create a new focus area
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const focusArea = new FocusArea({
            title: req.body.title,
            image: req.file.buffer
        });
        const newFocusArea = await focusArea.save();
        res.status(201).json(newFocusArea);
    } catch (error) {
        console.error('Error saving focus area:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update a focus area
router.put('/:id', getFocusArea, upload.single('image'), async (req, res) => {
    if (req.body.title != null) {
        res.focusArea.title = req.body.title;
    }
    if (req.file != null) {
        res.focusArea.image = req.file.buffer;
    }
    try {
        const updatedFocusArea = await res.focusArea.save();
        res.json(updatedFocusArea);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a focus area
router.delete('/:id', getFocusArea, async (req, res) => {
    try {
        await res.focusArea.deleteOne();
        res.json({ message: 'Deleted Focus Area' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while deleting the focus area' });
    }
});

module.exports = router;