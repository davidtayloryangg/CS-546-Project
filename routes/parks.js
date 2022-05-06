const express = require("express");
const router = express.Router();
const data = require("../data/parks");
const activitydata = require("../data/activities");
const userdata = require("../data/users");
const commentdata = require("../data/comments");
const activity_data = require("../data/activities");
const appointment_data = require("../data/appointments");
var xss = require("xss");

router.route("/").get(async (req, res) => {
  try {
    const parks = await data.getAllParks();
    for (let park of parks) {
      park.rating = (park.averageRating / 5) * 100;
    }
    var isAdmin = false;
    if (req.session.user && req.session.user.permission === "admin")
      isAdmin = true;
    res.render("function/Park List", {
      parks: parks,
      isAdmin: isAdmin,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.route("/ParksOrderByRating").get(async (req, res) => {
  try {
    const parks = await data.getParksOrderByRating();
    res.status(200).json(parks);
  } catch (e) {
    res.status(500).json(e);
  }
});
router.route("/ParksOrderByLikes").get(async (req, res) => {
  try {
    const parks = await data.getParksOrderByLikes();
    res.status(200).json(parks);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.route("/search").post(async (req, res) => {
  try {
    const info = req.body;
    let searchdata;
    if ("parkname" in info) {
      const infoparkname = xss(info.parkname);
      searchdata = await data.getParksByName(infoparkname);
    } else {
      const infoactivityname = xss(info.activityname);
      searchdata = await activitydata.getAllParksByActivityName(
        infoactivityname
      );
    }
    res.status(200).json(searchdata);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.route("/id/:id").get(async (req, res) => {
  try {
    const parks = await data.getParkById(req.params.id);
    console.log(parks);
    const rating = (parks.averageRating / 5) * 100;
    console.log(req.session);
    if (req.session.user) {
      const user = await userdata.getUserById(req.session.user.userId);
      // console.log(user);
      const favorites = user.favorites;
      console.log(parks._id);
      console.log(favorites);
      let isFav = false;
      for (let favorite of favorites) {
        console.log(favorite.parkId);
        if (favorite.parkId.toString() === parks._id.toString()) {
          isFav = true;
        }
      }
      res.render("function/SinglePark", {
        parks: parks,
        rating: rating,
        favorite: isFav,
      });
    } else {
      res.render("function/SinglePark", { parks: parks, rating: rating });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router
  .route("/id/:id/edit")
  .get(async (req, res) => {
    if (!req.session.user) {
      res.status(400).redirect("/users");
    } else {
      try {
        const park = await data.getParkById(req.params.id);
        res.status(200).render("function/EditPark", { parks: park });
      } catch (error) {
        res.status(500).json({ error: error });
      }
    }
  })
  .post(async (req, res) => {
    try {
      const updatedParkInfo = req.body;
      if (
        !updatedParkInfo.id ||
        !updatedParkInfo.name ||
        !updatedParkInfo.openTime ||
        !updatedParkInfo.closeTime ||
        !updatedParkInfo.location
      )
        throw "Please porvide all the input for updatePark!";
      // const { id, name, openTime, closeTime, location } = updatedParkInfo;
      const id = xss(updatedParkInfo.id);
      const name = xss(updatedParkInfo.name);
      const openTime = xss(updatedParkInfo.openTime);
      const closeTime = xss(updatedParkInfo.closeTime);
      const location = xss(updatedParkInfo.location);
      const updatedPark = await data.updatePark(
        id,
        name,
        openTime,
        closeTime,
        location
      );
      res.status(200).redirect(`/parks/id/${id}`);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router
  .route("/CreatePark")
  .get(async (req, res) => {
    if (!req.session.user) {
      res.status(400).redirect("/users");
    } else {
      res.status(200).render("function/CreatePark");
    }
  })
  .post(async (req, res) => {
    try {
      const newParkInfo = req.body;
      if (
        !newParkInfo.name ||
        !newParkInfo.openTime ||
        !newParkInfo.closeTime ||
        !newParkInfo.location
      )
        throw "Please provide all input for createPark!";
      const name = xss(newParkInfo.name);
      const openTime = xss(newParkInfo.openTime);
      const closeTime = xss(newParkInfo.closeTime);
      const location = xss(newParkInfo.location);
      // const { name, openTime, closeTime, location } = newParkInfo;
      const newParkId = await data.createPark(
        name,
        openTime,
        closeTime,
        location
      );
      res.status(200).redirect("/parks/id/" + newParkId._id);
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
          reply: element.reply,
        };
        userList.push(user);
      }
      res.status(200).json(userList);
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
        if (!info.newCommentRating || !info.newCommentTxt)
          throw "Please provide all the input for createComment!";
        const infonewCommentRating = xss(info.newCommentRating);
        const infonewCommentTxt = xss(info.newCommentTxt);
        const comment = await commentdata.createComment(
          parkId,
          userInfo.userId,
          infonewCommentRating,
          infonewCommentTxt
        );
        res.status(200).json(comment);
      } catch (error) {
        res.status(500).json({ error: error });
      }
    } else
      res
        .status(400)
        .render("function/Login", { error: "Log in to comment parks!!!" });
  });

router.route("/id/comments/reply/:id").post(async (req, res) => {
  if (req.session.user) {
    try {
      const userInfo = req.session.user;
      const info = req.body;
      const commentId = req.params.id;
      if (!info.newCommentTxt)
        throw "Please provide all the input for replyComment!";
      const replyToUser = await commentdata.getUserByCommentId(commentId);
      const comment =
        "@" +
        replyToUser.firstname +
        replyToUser.lastname +
        " " +
        info.newCommentTxt;
      const updated = await commentdata.replyComment(
        commentId,
        userInfo.userId,
        comment
      );
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else
    res
      .status(400)
      .render("function/Login", { error: "Log in to comment parks!!!" });
});

router.route("/id/comments/reply/:id").post(async (req, res) => {
  if (req.session.user) {
    try {
      const userInfo = req.session.user;
      const info = req.body;
      const commentId = req.params.id;
      const replyToUser = await commentdata.getUserByCommentId(commentId);
      const comment =
        "@" +
        replyToUser.firstname +
        replyToUser.lastname +
        " " +
        info.newCommentTxt;
      const updated = await commentdata.replyComment(
        commentId,
        userInfo.userId,
        comment
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else res.render("function/Login", { error: "Log in to comment parks!!!" });
});

// Creating new activity:
router.get("/newActivity", async (req, res) => {
  if (!req.session.user) {
    res.status(400).redirect("/users");
  } else {
    let ParkList = await data.getAllParks();
    res
      .status(200)
      .render("function/Activity_newActivity", { ParkList: ParkList });
  }
});

router.post("/createnewActivity", async (req, res) => {
  if (!req.session.user) {
    res.status(400).redirect("/users");
  } else {
    try {
      var body = req.body;
      if (
        !body.park ||
        !body.activity ||
        !body.numberOfCourts ||
        !body.maxPeople ||
        !body.limit
      )
        throw "Please provide all the input for createActivity!";
      const bodypark = xss(body.park);
      const getpark = await data.getParksByName(bodypark);
      const parkId = getpark[0]._id;
      const activity = xss(body.activity);
      const numberOfCourts = xss(body.numberOfCourts);
      const maxPeople = xss(body.maxPeople);
      const limit = xss(body.limit);
      const Appointments = await activitydata.createActivity(
        parkId,
        activity,
        numberOfCourts,
        maxPeople,
        limit
      );
      res.status(200).render("function/Appointment_Created", {
        result: `You have created ${body.activity} for ${body.park}!`,
        title: "Created",
      });
    } catch (e) {
      res
        .status(500)
        .render("function/Appointment_Error", { error: e, title: "Error" });
    }
  }
});

// Warning!!!
// Something really bad would happen if you insit on deleting the activity!!!!

// Removing an activity:
router.get("/checkActivity", async (req, res) => {
  if (!req.session.user) {
    res.status(400).redirect("/users");
  } else {
    res.status(200).render("function/Activity_checkActivity");
  }
});

router.post("/removeActivity", async (req, res) => {
  if (!req.session.user) {
    res.status(400).redirect("/users");
  } else {
    try {
      var body = req.body;
      const bodypark = xss(body.park);
      const parkId = await appointment_data.getParkIdByParkname(bodypark);
      const activity = xss(body.activity);
      const Appointments = await activitydata.deleteActivity(parkId, activity);
      res.status(200).render("function/Appointment_Created", {
        result: `You have removed ${body.activity} for ${body.park}!`,
        title: "Deleted",
      });
    } catch (e) {
      res
        .status(500)
        .render("function/Appointment_Error", { error: e, title: "Error" });
    }
  }
});
module.exports = router;
