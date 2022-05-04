const express = require("express");
const router = express.Router();
const data = require("../data/parks");

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

router.route("/AllParks").get(async (req, res) => {
  try {
    const allParks = await data.getAllParks();
    res.json(allParks);
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

// router.route("/:id").get(async (req, res) => {
//   try {
//     const parks = await data.getParkById(req.params.id);
//     res.render("function/SinglePark", { parks: parks });
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// });

module.exports = router;
