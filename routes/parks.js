const express = require("express");
const router = express.Router();
const data = require("../data/parks");
const activitydata = require("../data/activities")
const userdata = require("../data/users");
const commentdata = require("../data/comments");
const activity_data = require('../data/activities');
const appointment_data = require('../data/appointments');

router
  .route("/")
  .get(async (req, res) => {
    try {
      const parks = await data.getAllParks();
      var isAdmin = false;
      if (req.session.user && req.session.user.permission === "admin")
        isAdmin = true;
      res.render("function/Park List", { parks: parks, isAdmin: isAdmin });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  })

router.route("/ParksOrderByRating").get(async (req, res) => {
  try {
    const parks = await data.getParksOrderByRating();
    res.json(parks);
  } catch (e) {
    res.status(500).json(e);
  }
});
router.route("/ParksOrderByLikes").get(async (req, res) => {
  try {
    const parks = await data.getParksOrderByLikes();
    res.json(parks);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.route("/search").post(async (req, res) => {
  try {
    const info = req.body;
    let searchdata;
    if ('parkname' in info) searchdata = await data.getParksByName(info.parkname);
    else searchdata = await activitydata.getAllParksByActivityName(info.activityname);
    res.json(searchdata);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.route("/id/:id").get(async (req, res) => {
  try {
    const parks = await data.getParkById(req.params.id);
    res.render("function/SinglePark", { parks: parks });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router
  .route("/id/:id/edit")
  .get(async (req, res) => {
    if (!req.session.user) {
      res.redirect("/users");
    } else {
      try {
        const park = await data.getParkById(req.params.id);
        res.render("function/EditPark", { parks: park });
      } catch (error) {
        res.status(500).json({ error: error });
      }
    }
  })
  .post(async (req, res) => {
    try {
      const updatedParkInfo = req.body;
      console.log(updatedParkInfo);
      const { id, name, openTime, closeTime, location } = updatedParkInfo;
      const updatedPark = await data.updatePark(
        id,
        name,
        openTime,
        closeTime,
        location
      );
      res.redirect(`/parks/id/${id}`);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router
  .route("/CreatePark")
  .get(async (req, res) => {
    if (!req.session.user) {
      res.redirect("/users");
    } else {
      res.render("function/CreatePark");
    }
  })
  .post(async (req, res) => {
    try {
      // console.log(req.body);
      const newParkInfo = req.body;
      const { name, openTime, closeTime, location } = newParkInfo;
      // console.log(name, openTime, closeTime, location);
      const newParkId = await data.createPark(
        name,
        openTime,
        closeTime,
        location
      );
      res.redirect("/parks/id/" + newParkId._id);
    } catch (e) {
      res.status(500).json(e);
    }
  });

router
  .route("/id/comments/:id")
  .get(async (req, res) => {
    if (req.session && req.session.user)
      var currentUsername = req.session.user.name;
    else currentUsername = null;
    try {
      const park = await data.getParkById(req.params.id);
      const comments = park.comments;
      var userList = [];
      for (const element of comments) {
        const userInfo = await userdata.getUserById(element.userId);
        const name = userInfo.firstname + " " + userInfo.lastname;
        var user = {
          currentUsername: currentUsername,
          userId: element.userId,
          username: name,
          comment: element.parkComment,
          timestamp: element.timestamp,
          commentId: element._id,
          reply: element.reply
        }
        userList.push(user);
      }
      res.json(userList);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  })
  .post(async (req, res) => {
    if (req.session.user) {
      try {
        const userInfo = req.session.user;
        const info = req.body;
        const parkId = req.params.id;
        const comment = await commentdata.createComment(parkId, userInfo.userId, info.newCommentRating, info.newCommentTxt);
        res.json(comment);
      } catch (error) {
        res.status(500).json({ error: error });
      }
    }
    else res.render('function/Login', { error: "Log in to comment parks!!!" });
  });

router
  .route("/id/comments/reply/:id")
  .post(async (req, res) => {
    if (req.session.user) {
      try {
        const userInfo = req.session.user;
        const info = req.body;
        const commentId = req.params.id;
        const replyToUser = await commentdata.getUserByCommentId(commentId);
        const comment = "@" + replyToUser.firstname + replyToUser.lastname + " " + info.newCommentTxt;
        const updated = await commentdata.replyComment(commentId, userInfo.userId, comment);
        res.json(updated);
      } catch (error) {
        res.status(500).json({ error: error });
      }
    } else
      res.render("function/Login", { error: "Log in to comment parks!!!" });
  });

// Creating new activity:
router.get('/newActivity', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    res.render('function/Activity_newActivity');
  }
});

router.post('/createnewActivity', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    try {
      var body = req.body;
      const parkId = await appointment_data.getParkIdByParkname(body.park);
      const activity = body.activity
      const numberOfCourts = body.numberOfCourts;
      const maxPeople = body.maxPeople;
      const Appointments = await activity_data.createActivity(parkId, activity, numberOfCourts, maxPeople);
      res.render('function/Appointment_Created', { result: `You have created ${body.activity} for ${body.park}!`, title: "Created" });
    } catch (e) {
      res.status(404).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  }
});

// Warning!!! 
// Something really bad would happen if you insit on deleting the activity!!!!

// Removing an activity:
router.get('/checkActivity', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    res.render('function/Activity_checkActivity');
  }
});

router.post('/removeActivity', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    try {
      var body = req.body;
      const parkId = await appointment_data.getParkIdByParkname(body.park);
      const activity = body.activity
      const Appointments = await activity_data.deleteActivity(parkId, activity);
      res.render('function/Appointment_Created', { result: `You have removed ${body.activity} for ${body.park}!`, title: "Deleted" });
    } catch (e) {
      res.status(404).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  }
});
module.exports = router;
