const express = require('express');
const router = express.Router();
const data = require('../data/reviews');
const func = require('../data/functions');
var xss = require("xss");

router
  .route('/')
  .get(async (req, res) => {
    try {
      if (!req.session.user) res.redirect('/users');
      const reviews = await data.getAllReviews();
      res.status(200).json(reviews);
    } catch (e) {
      res.status(500).json(e);
    }
  })
  .post(async (req, res) => {
    try {
      let reviewInfo = req.body;
      if (!reviewInfo.activitityId || !reviewInfo.userReview) throw 'please provide all inputs for createReview!';
      if (!func.checkString(reviewInfo.userReview))
        res.status(400).json({ error: 'invalid inputs' });
      const reviewInfoactivitityId = xss(reviewInfo.activitityId);
      const reviewInfouserReview = xss(reviewInfo.userReview);
      const review = await data.createReview(
        req.session.user._id,
        reviewInfoactivitityId,
        reviewInfouserReview
      );
      res.status(200).redirect('/activities/'+reviewInfo.activityId)

    } catch (e) {
      res.status(500).json(e);
    }
  });

  module.exports = router;