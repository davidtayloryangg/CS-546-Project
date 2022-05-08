const express = require('express');
const router = express.Router();
const data = require('../data/activities');
const parkdata = require('../data/parks');
const userdata = require('../data/users')
const reviewdata = require('../data/reviews')
var xss = require("xss");

router
  .route('/')
  .get(async (req, res) => {
    try {
      var isAdmin = false;
      if (req.session.user && req.session.user.permission === "admin")
        isAdmin = true;

      const actList = await data.getAllactivities();
      res.status(200).render('function/Activity', { actList, isAdmin });
    } catch (e) {
      res.status(404).json(e);
    }
  })

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const activity = await data.get(req.params.id)
      const park = await parkdata.getParkById(activity.parkId)
      let user;
      let reviews = [];
      for (let review of activity.reviews) {
        user = await userdata.getUserById(review.userId)
        reviews.push({
          userId: user._id,
          username: user.firstname + user.lastname,
          userReview: review.userReview,
        })
      }
      let singleactivity = {
        activityId: req.params.id,
        parkId: park._id,
        activityname: activity.name,
        numberOfCourts: activity.numberOfCourts,
        maxPeople: activity.maxPeople,
        parkname: park.name,
        reviews: reviews
      }
      res.status(200).render("function/SingleActivity", { activity: singleactivity });
    } catch (error) {
      res.status(404).json({ error: error });
    }
  });



router
  .route("/:id")
  .post(async (req, res) => {
    if (!req.session.user) res.redirect('/users/login');
    else {
      try {
        if (!req.body.activityId || !req.body.Review) throw "Please provide all input for createReview!"
        // const { activityId,  Review } = req.body
        const activityId = xss(req.body.activityId);
        const Review = xss(req.body.Review);
        //const activity = await data.get(activityId)
        //const user = await userdata.getUserByEmail(req.session.user.email)
        await reviewdata.createReview(req.session.user.userId.toString(), activityId, Review)
        res.status(200).redirect('/activities/' + req.params.id)
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  });

module.exports = router;