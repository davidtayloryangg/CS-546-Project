const express = require("express");
const router = express.Router();
const data = require("../data/parks");
const userdata = require("../data/users");

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
    const park = await data.getParkById(req.params.id);
    res.render("function/SinglePark", { parks: park });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router
  .route("/id/comments/:id")
  .get(async (req, res) => {
    try {
      const park = await data.getParkById(req.params.id);
      const comments = park.comments;
      var userList = [];
      for (const element of comments) {
        var user = {};
        const userInfo = await userdata.getUserById(element.userId);
        const name = userInfo.firstname + " " + userInfo.lastname;
        user.userId = element.userId;
        user.username = name;
        user.comment = element.parkComment;
        userList.push(user);
      }
      res.json(userList);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  })
  .post(async (req, res) => {
    try {
      const park = await data.getParkById(req.params.id);

    } catch (error) {
      res.status(500).json({ error: error });
    }
  })

module.exports = router;
