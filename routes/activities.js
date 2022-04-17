const express = require('express');
const router = express.Router();
const data = require('../data/activities');

router
.route('/parks/activities')
.get(async (req, res) => {
    try {
        const activities = await data.getAllActivity();
        res.json(activities);
    } catch (e) {
        res.status(500).json(e);
    }
})
.post(async (req, res) => {
    let activityInfo = req.body;
    if (!activityInfo.parkId || !activityInfo.name || !activityInfo.numberOfCourts|| !activityInfo.maxPeople|| !activityInfo.appointmens|| !activityInfo.comments|| !activityInfo.reviews) throw 'please provide all inputs';
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