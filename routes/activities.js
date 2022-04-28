const express = require('express');
const router = express.Router();
const data = require('../data/activities');
const parkdata = require('../data/parks');
router
  .route('/')
  .get(async (req, res) => {
    try {

      const tennis = await parkdata.getAllParksByActivityName("Tennis");
      const Basketball = await parkdata.getAllParksByActivityName("Basketball");
      const Jog = await parkdata.getAllParksByActivityName("Jog");
      const Soccer = await parkdata.getAllParksByActivityName("Soccer");
      const Baseball = await parkdata.getAllParksByActivityName("Baseball");
      const Skate = await parkdata.getAllParksByActivityName("Skate");
      const Yoga = await parkdata.getAllParksByActivityName("Yoga");
      const Rugby = await parkdata.getAllParksByActivityName("Rugby");

      res.render('function/Activity', {tennis, Basketball, Jog, Soccer, Baseball, Skate, Yoga, Rugby});
    } catch (e) {
      res.status(500).json(e);
    }
  })
  .post(async (req, res) => {
    let activityInfo = req.body;
    if (!activityInfo.parkId || !activityInfo.name || !activityInfo.numberOfCourts || !activityInfo.maxPeople || !activityInfo.appointmens || !activityInfo.comments || !activityInfo.reviews) throw 'please provide all inputs';
    // if (typeof activityInfo.parkId != 'string'|| activityInfo.parkId.trim() == 0)
    //     res.status(400).json({ error: 'invalid parkId' });
    // if (typeof activityInfo.name != 'string'|| activityInfo.name.trim() == 0)
    //     res.status(400).json({ error: 'invalid name' });
    // if(typeof activityInfo.numberOfCourts != 'number')
    //     res.status(400).json({error:'numberOfCourts shoule be number'})
    // if(typeof activityInfo.maxPeople != 'number')
    //     res.status(400).json({error:'maxPeople shoule be number'})
    try {
      const activity = await data.createActivity(
        activityInfo.parkId,
        activityInfo.name,
        activityInfo.numberOfCourts,
        activityInfo.maxPeople,
        activityInfo.appointmens,
        activityInfo.comments,
        activityInfo.reviews
      );
      res.status(200).json(activity);
    } catch (e) {
      res.status(400).json(e);
    }
  })

module.exports = router;