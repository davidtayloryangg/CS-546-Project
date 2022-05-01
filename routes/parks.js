const express = require("express");
const router = express.Router();
const data = require("../data/parks");
const activity_data = require('../data/activities');
const appointment_data = require('../data/appointments');

router.get("/", function (req, res) {
  data.getAllParks().then(
    (parks) => {
      res.render("function/Park List", { parks: parks });
    },
    (error) => {
      res.status(500).json({ error: error });
    }
  );
});

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
    const searchParks = await data.getParksByName(info.parkName);
    res.json(searchParks);
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

// Creating new activity:
router.get('/newActivity', async (req, res) => {
  if (!req.session.user){
    res.redirect('/users');
  } else{
    res.render('function/Activity_newActivity');
  }
});

router.post('/createnewActivity', async (req, res) => {
  if (!req.session.user){
    res.redirect('/users');
  } else{
    try {
      var body = req.body;
      const parkId = await appointment_data.getParkIdByParkname(body.park);
      const activity = body.activity
      const numberOfCourts = body.numberOfCourts;
      const maxPeople = body.maxPeople;
      const Appointments = await activity_data.createActivity(parkId, activity, numberOfCourts, maxPeople);
      res.render('function/Appointment_Created',{ result: `You have created ${body.activity} for ${body.park}!`, title: "Created"});
    } catch (e) {
      res.status(404).render('function/Appointment_Error',{ error: e, title: "Error"});
    }
  }
});
module.exports = router;
