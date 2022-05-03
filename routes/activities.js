const express = require('express');
const router = express.Router();
const data = require('../data/activities');
const parkdata = require('../data/parks');
const userdata=require('../data/users')
router
  .route('/')
  .get(async (req, res) => {
    try {

      const tennis = await data.getAllParksByActivityName("Tennis");
      const Basketball = await data.getAllParksByActivityName("Basketball");
      const Jog = await data.getAllParksByActivityName("Jog");
      const Soccer = await data.getAllParksByActivityName("Soccer");
      const Baseball = await data.getAllParksByActivityName("Baseball");
      const Skate = await data.getAllParksByActivityName("Skate");
      const Yoga = await data.getAllParksByActivityName("Yoga");
      const Rugby = await data.getAllParksByActivityName("Rugby");

      res.render('function/Activity', { tennis, Basketball, Jog, Soccer, Baseball, Skate, Yoga, Rugby });
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
  });
router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const activity=await data.get(req.params.id)
      const park=await parkdata.getParkById(activity.parkId)
      let singleactivity={
        activityId:req.params.id,
        parkId:park._id,
        activityname:activity.name,
        parkname:park.name,
        comments:activity.comments
      }
      res.render("function/SingleActivity", {activity:singleactivity});
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });
  router
  .route("/:id")
  .post(async (req, res) => {
    if (!req.session.user) res.redirect('/users/login');
    else{
      try {
        const {activityId,star,Comment}=req.body
        const activity=await data.get(activityId)
        const user=await userdata.getUserByEmail(req.session.user.email)
        let myday=new Date()
        let date=(myday.getMonth()+1).toString()+"/"+(myday.getDate()).toString()+"/"+(myday.getFullYear())
        let newcomment={
          username:user.firstname+" "+user.lastname,
          userid:user._id.toString(),
          star:Number(star),
          comment:Comment,
          reviews:[],
          time:date
        }
        activity.comments.push(newcomment)
        await data.updateActivity(activityId, activity.parkId, activity.name, activity.numberOfCourts, activity.maxPeople, activity.appointments, activity.comments)
        res.redirect('/activities/'+req.params.id)
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  });


module.exports = router;