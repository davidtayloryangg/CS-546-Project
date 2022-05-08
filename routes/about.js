const express = require('express');
const router = express.Router();
var xss = require("xss");

router.get('/', async (req, res) => {
  res.status(200).render('function/About')
});

module.exports = router;