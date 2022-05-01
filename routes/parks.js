const express = require("express");
const router = express.Router();
const data = require("../data/parks");
const userdata = require("../data/users");
const commentdata = require("../data/comments");

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
    if (req.session && req.session.user)
      var currentUsername = req.session.user.name;
    else
      currentUsername = null;
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
          commentId: element._id
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
        await commentdata.createComment(parkId, userInfo.userId, info.newCommentRating, info.newCommentTxt);
      } catch (error) {
        res.status(500).json({ error: error });
      }
    }
    else res.render('function/Login', { error: "Log in to comment parks!!!" });
  })

module.exports = router;
