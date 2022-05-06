const express = require('express');
const router = express.Router();
const data = require('../data/activities');
const parkdata = require('../data/parks');
const userdata = require('../data/users')
const reviewdata=require('../data/reviews')
var xss = require("xss");

router
  .route('/')
  .get(async (req, res) => {
    try {
      var isAdmin = false;
      if (req.session.user && req.session.user.permission === "admin")
        isAdmin = true;

      const tennis = setActitityIdInPark("Tennis", await data.getAllParksByActivityName("Tennis"));
      const Basketball = setActitityIdInPark("Basketball", await data.getAllParksByActivityName("Basketball"));
      const Jog = setActitityIdInPark("Jog", await data.getAllParksByActivityName("Jog"));
      const Soccer = setActitityIdInPark("Soccer", await data.getAllParksByActivityName("Soccer"));
      const Baseball = setActitityIdInPark("Baseball", await data.getAllParksByActivityName("Baseball"));
      const Skate = setActitityIdInPark("Skate", await data.getAllParksByActivityName("Skate"));
      const Yoga = setActitityIdInPark("Yoga", await data.getAllParksByActivityName("Yoga"));
      const Rugby = setActitityIdInPark("Rugby", await data.getAllParksByActivityName("Rugby"));

      res.status(200).render('function/Activity', { tennis, Basketball, Jog, Soccer, Baseball, Skate, Yoga, Rugby, isAdmin: isAdmin });
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
      let reviews=[];
      for(let review of activity.reviews){
        user=await userdata.getUserById(review.userId)
        reviews.push({
          userId:user._id,
          username:user.firstname+user.lastname,
          userReview: review.userReview,
        })
      }
      let singleactivity = {
        activityId: req.params.id,
        parkId: park._id,
        activityname: activity.name,
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

function setActitityIdInPark(activityName, parkList) {
  for (let p of parkList) {
    for (let a of p.activities) {
      if (a.name.indexOf(activityName) !== -1) {
        p.activityId = a._id;
        break;
      }
    }
  }
  return parkList;
}

module.exports = router;