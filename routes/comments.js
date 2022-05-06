const express = require('express');
const router = express.Router();
const data = require('../data/comments');
const func = require('../data/functions');
var xss = require("xss");

router
  .route('/parks/comments')
  .get(async (req, res) => {
    try {
      const comments = await data.getAllComments();
      res.status(200).json(comments);
    } catch (e) {
      res.status(500).json(e);
    }
  })
  .post(async (req, res) => {
    try {
      let commentInfo = req.body;
      if (!commentInfo.parkId || !commentInfo.rating || !commentInfo.parkComment) throw 'please provide all inputs';
      const commentInfoparkId = xss(commentInfo.parkId);
      const commentInforating = xss(commentInfo.rating);
      const commentInfoparkComment = xss(commentInfo.parkComment);
      if (!func.checkId(commentInfoparkId) || !func.checkRating(commentInforating) || !func.checkString(commentInfoparkComment))
        res.status(400).json({ error: 'invalid inputs' });
      const comment = await data.createComment(
        commentInfoparkId,
        commentInforating,
        commentInfoparkComment
      );
      res.status(200).json(comment);
    } catch (e) {
      res.status(400).json(e);
    }
  });
  module.exports = router;