const express = require('express');
const router = express.Router();
const multer = require('multer');
const Alumni = require('../models/alumni');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all alumni
router.get('/', async (req, res) => {
    try {
        const alumni = await Alumni.find();
        res.json(alumni);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        res.status(500).send('Server error');
    }
});

// GET alumni by batch name
router.get('/batch/:batchName', async (req, res) => {
    try {
        const alumni = await Alumni.find({ batchName: req.params.batchName });
        res.json(alumni);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        res.status(500).send('Server error');
    }
});

// POST new alumni
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const { name, role, github, linkedin, email, batchName } = req.body;
        const photo = req.file.buffer;

        const newAlumni = new Alumni({ name, role, github, linkedin, email, photo, batchName });
        await newAlumni.save();
        res.status(201).json(newAlumni);
    } catch (error) {
        console.error('Error adding alumni:', error);
        res.status(500).send('Server error');
    }
});

// PUT update alumni
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        const { name, role, github, linkedin, email, batchName } = req.body;
        const updateData = { name, role, github, linkedin, email, batchName };
        if (req.file) {
            updateData.photo = req.file.buffer;
        }

        const updatedAlumni = await Alumni.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedAlumni) {
            return res.status(404).send('Alumni not found');
        }
        res.json(updatedAlumni);
    } catch (error) {
        console.error('Error updating alumni:', error);
        res.status(500).send('Server error');
    }
});

// DELETE alumni
router.delete('/:id', async (req, res) => {
    try {
        const deletedAlumni = await Alumni.findByIdAndDelete(req.params.id);
        if (!deletedAlumni) {
            return res.status(404).send('Alumni not found');
        }
        res.send('Alumni deleted successfully');
    } catch (error) {
        console.error('Error deleting alumni:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
