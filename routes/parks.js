const express = require('express');
const router = express.Router();
const data = require('../data/parks');

router
.route('/parks/allParks')
.get(async (req, res) => {
    try{
        const allParks = await data.getAllParks();
        res.json(allParks);
    }catch (e) {
        res.status(500).json(e);
    }
})

router
.route('/parks/search')
.get(async (req, res) => {
    try{
        const searchParks = await data.getParkByName();
        res.json(searchParks);
    }catch (e) {
        res.status(500).json(e);
    }
})