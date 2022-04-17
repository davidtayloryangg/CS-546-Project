const express = require('express');
const router = express.Router();
const data = require('../data/parks');

router
    .route('/allParks')
    .get(async (req, res) => {
        try {
            const allParks = await data.getAllParks();
            res.json(allParks);
        } catch (e) {
            res.status(500).json(e);
        }
    })

router
    .route('/')
    .get(async (req, res) => {
        try {
            const info = req.body;
            const searchParks = await data.getParkByName(info.showSearchTerm);
            res.json(searchParks);
        } catch (e) {
            res.status(500).json(e);
        }
    })
    .post(async (req, res) => {
        try {
            const info = req.body;
            const searchParks = await data.getParkByName(info.showSearchTerm);
            res.json(searchParks);
        } catch (e) {
            res.status(500).json(e);
        }
    })

module.exports = router;