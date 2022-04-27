const express = require('express');
const router = express.Router();
const data = require('../data/parks');

router
  .route('/AllParks')
  .get(async (req, res) => {
    try {
      const allParks = await data.getAllParks();
      res.json(allParks);
    } catch (e) {
      res.status(500).json(e);
    }
  })

router
  .route('/search')
  .post(async (req, res) => {
    try {
      const info = req.body;
      const searchParks = await data.getParksByName(info.parkName);
      res.json(searchParks);
    } catch (e) {
      res.status(500).json(e);
    }
  })

module.exports = router;