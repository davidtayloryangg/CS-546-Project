const express = require("express");
const router = express.Router();
const data = require("../data/parks");
const activitydata=require("../data/activities")

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
    let searchdata;
    if('parkname' in info) searchdata = await data.getParksByName(info.parkname);
    else searchdata=await activitydata.getAllParksByActivityName(info.activityname);
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

module.exports = router;
