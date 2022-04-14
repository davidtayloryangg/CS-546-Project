const express = require('express');
const router = express.Router();
const data = require('../data/comments');
const func = require('../data/functions');

router
  .route('/parks/comments')
  .get(async (req, res) => {
    try {
      const comments = await data.getAllComments();
      res.json(comments);
    } catch (e) {
      res.status(500).json(e);
    }
  })
  .post(async (req, res) => {
    let commentInfo = req.body;
    if (!commentInfo.userId || !commentInfo.rating || !commentInfo.parkReviews) throw 'please provide all inputs';
    if (!func.checkId || !func.checkRating || !func.checkString)
      res.status(400).json({ error: 'invalid inputs' });
    try {
      const comment = await data.createComment(
        commentInfo.parkId,
        commentInfo.rating,
        commentInfo.parkReviews
      );
      res.status(200).json(comment);
    } catch (e) {
      res.status(400).json(e);
    }
  });