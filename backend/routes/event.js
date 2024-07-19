const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Event = require('../models/event');

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to get an event by ID
async function getEvent(req, res, next) {
    let event;
    try {
        event = await Event.findById(req.params.id);
        if (event == null) {
            return res.status(404).json({ message: 'Cannot find event' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.event = event;
    next();
}

// Events Routes

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one event
router.get('/:id', getEvent, (req, res) => {
    res.json(res.event);
});

// Create a new event
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const event = new Event({
            title: req.body.title,
            smallDescription: req.body.smallDescription,
            longDescription: req.body.longDescription,
            image: req.file.buffer,
            eventDate: new Date(req.body.eventDate)
        });
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error saving event:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update an event
router.put('/:id', getEvent, upload.single('image'), async (req, res) => {
    if (req.body.title != null) {
        res.event.title = req.body.title;
    }
    if (req.body.smallDescription != null) {
        res.event.smallDescription = req.body.smallDescription;
    }
    if (req.body.longDescription != null) {
        res.event.longDescription = req.body.longDescription;
    }
    if (req.file != null) {
        res.event.image = req.file.buffer;
    }
    if (req.body.eventDate != null) {
        res.event.eventDate = new Date(req.body.eventDate);
    }
    try {
        const updatedEvent = await res.event.save();
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an event
router.delete('/:id', getEvent, async (req, res) => {
    try {
        await res.event.deleteOne();
        res.json({ message: 'Deleted Event' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while deleting the event' });
    }
});

module.exports = router;