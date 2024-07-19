const mongoose = require('mongoose');
const multer = require('multer');
const teamSchema = require('../models/teams');
const express = require('express');
const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to check if a collection exists
const collectionExists = async (collectionName) => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.some(collection => collection.name === collectionName);
};

// Helper function to get all batch names starting from a given year
const getAllBatches = (collections, startYear) => {
    const batchNames = collections
        .map(collection => collection.name)
        .filter(name => name.startsWith('Batch-') && parseInt(name.split('-')[1]) >= startYear)
        .sort()
        .reverse();
    return batchNames;
}

router.get('/batches', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const startYear = 2023; // Specify the start year here
        const batchNames = getAllBatches(collections, startYear);

        if (batchNames.length === 0) {
            return res.status(404).send('No batches found');
        }

        res.status(200).send(batchNames);
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).send('Server Error');
    }
});

router.get('/latest-batch', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const batchNames = collections.map(collection => collection.name).filter(name => name.startsWith('Batch-'));
        
        if (batchNames.length === 0) {
            return res.status(404).send('No batches found');
        }

        const latestBatch = batchNames.sort().reverse()[0];
        res.status(200).send({ latestBatch });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to add a new team to a specific batch
router.post('/:batchName', upload.single('photo'), async (req, res) => {
    const { batchName } = req.params;
    const { teamNumber, name, role, github, linkedin, email } = req.body;
    const photo = req.file ? req.file.buffer : null;

    try {
        // Check if the new batch collection already exists
        const batchExists = await collectionExists(batchName);

        if (!batchExists) {
            // Create a new collection for the current batch
            const Batch = mongoose.model(batchName, teamSchema, batchName);

            // Save team data to the current batch collection
            const team = new Batch({
                teamNumber,
                name,
                role,
                github,
                linkedin,
                email,
                photo
            });
            await team.save();

            // Respond with success
            res.status(201).send(team);
        } else {
            // If the batch already exists, add the team to the existing batch
            const Batch = mongoose.model(batchName, teamSchema, batchName);
            const team = new Batch({
                teamNumber,
                name,
                role,
                github,
                linkedin,
                email,
                photo
            });
            await team.save();
            res.status(201).send(team);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/:batchName', async (req, res) => {
    const { batchName } = req.params;

    const Team = mongoose.model(batchName, teamSchema, batchName);

    try {
        const teams = await Team.find();
        res.status(200).send(teams);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:batchName/team/:teamNumber', async (req, res) => {
    const { batchName, teamNumber } = req.params;

    const Team = mongoose.model(batchName, teamSchema, batchName);

    try {
        const teams = await Team.find({ teamNumber: teamNumber });
        res.status(200).send(teams);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/:batchName/:id', upload.single('photo'), async (req, res) => {
    const { batchName, id } = req.params;
    const { teamNumber, name, role, github, linkedin, email } = req.body;
    const photo = req.file ? req.file.buffer : null;

    const Team = mongoose.model(batchName, teamSchema, batchName);

    try {
        const updateData = { teamNumber, name, role, github, linkedin, email };
        if (photo) {
            updateData.photo = photo;
        }

        const team = await Team.findByIdAndUpdate(id, updateData, { new: true });
        if (!team) {
            return res.status(404).send('Team not found');
        }
        res.status(200).send(team);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:batchName/:id', async (req, res) => {
    const { batchName, id } = req.params;

    const Team = mongoose.model(batchName, teamSchema, batchName);

    try {
        const team = await Team.findByIdAndDelete(id);
        if (!team) {
            return res.status(404).send('Team not found');
        }
        res.status(200).send('Team deleted successfully');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
