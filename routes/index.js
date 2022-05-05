const home = require("./home");
const users = require("./users");
const appointments = require("./appointments");
const parks = require("./parks");
const activities = require("./activities");
const comment = require("./comments");
const reviews=require("./reviews")

const constructorMethod = (app) => {
  // app.uses go here
  app.use("/", home);
  app.use("/users", users);
  app.use("/parks", parks);
  app.use("/appointments", appointments);
  app.use("/activities", activities);
  app.use("/reviews",reviews)

  app.all("*", (req, res) => {
    res.status(404).json("Error 404: ");
  });
};

module.exports = constructorMethod;
