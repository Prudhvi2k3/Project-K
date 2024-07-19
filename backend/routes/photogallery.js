const express = require('express');
const multer = require('multer');
const PhotoGallery = require('../models/photogallery');

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to get a photo gallery by ID
async function getPhotoGallery(req, res, next) {
    let photoGallery;
    try {
        photoGallery = await PhotoGallery.findById(req.params.id);
        if (!photoGallery) {
            return res.status(404).json({ message: 'Cannot find photo gallery' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.photoGallery = photoGallery;
    next();
}

// Photo Gallery Routes

// Get all photo galleries
router.get('/', async (req, res) => {
    try {
        const photoGalleries = await PhotoGallery.find();
        res.json(photoGalleries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one photo gallery
router.get('/:id', getPhotoGallery, (req, res) => {
    res.json(res.photoGallery);
});

// Create a new photo gallery
router.post('/', upload.array('images'), async (req, res) => {
    try {
      const photoGallery = new PhotoGallery({
        title: req.body.title,
        images: req.files.map(file => file.buffer)
      });
      const savedPhotoGallery = await photoGallery.save();
      res.status(201).json(savedPhotoGallery);
    } catch (error) {
      console.error('Error saving photo gallery:', error);
      res.status(400).json({ message: error.message });
    }
  });

// Update a photo gallery
router.put('/:id', getPhotoGallery, upload.array('images'), async (req, res) => {
    if (req.body.title != null) {
        res.photoGallery.title = req.body.title;
    }
    if (req.files != null && req.files.length > 0) {
        res.photoGallery.images = req.files.map(file => file.buffer);
    }
    try {
        const updatedPhotoGallery = await res.photoGallery.save();
        res.json(updatedPhotoGallery);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a photo gallery
router.delete('/:id', getPhotoGallery, async (req, res) => {
    try {
        await res.photoGallery.remove();
        res.json({ message: 'Deleted Photo Gallery' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;