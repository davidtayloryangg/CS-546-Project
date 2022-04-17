const express = require('express');
const router = express.Router();
const data = require('../data/reviews');
const func = require('../data/functions');

router
  .route('/users/reviews')
  .get(async (req, res) => {
    try {
      const reviews = await data.getAllReviews();
      res.json(reviews);
    } catch (e) {
      res.status(500).json(e);
    }
  })
  .post(async (req, res) => {
    let reviewInfo = req.body;
    if (!reviewInfo.userId  || !reviewInfo.userReview) throw 'please provide all inputs';
    if (!func.checkId(reviewInfo.userId)  || !func.checkString(reviewInfo.userReview))
      res.status(400).json({ error: 'invalid inputs' });
    try {
      const review = await data.createReview(
        reviewInfo.userId,
        reviewInfo.userReview
      );
      res.status(200).json(review);
    } catch (e) {
      res.status(400).json(e);
    }
  });