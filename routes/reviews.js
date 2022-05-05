const express = require('express');
const router = express.Router();
const data = require('../data/reviews');
const func = require('../data/functions');

router
  .route('/')
  .get(async (req, res) => {
    try {
      if (!req.session.user) res.redirect('/users');
      const reviews = await data.getAllReviews();
      res.json(reviews);
    } catch (e) {
      res.status(500).json(e);
    }
  })
  .post(async (req, res) => {
    let reviewInfo = req.body;
    if (!reviewInfo.userReview) throw 'please provide all inputs';
    if (!func.checkString(reviewInfo.userReview))
      res.status(400).json({ error: 'invalid inputs' });
    try {
      const review = await data.createReview(
        req.session.user._id,
        reviewInfo.activitityId,
        reviewInfo.userReview
      );
      res.redirect('/activities/'+reviewInfo.activityId)

    } catch (e) {
      res.status(400).json(e);
    }
  });

  module.exports = router;