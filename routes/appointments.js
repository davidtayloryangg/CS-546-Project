const express = require('express');
const router = express.Router();
const data = require('../data/appointments');
const parkdata = require('../data/parks');
const activitydata = require('../data/activities');
const userdata = require('../data/users');


router.get('/', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    res.render('function/Appointment_Menu');
  }
});

router.get('/myAppointment', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    try {
      let Appointments = await data.getAppointmentByemail(req.session.user.email);
      let park,activity,date;
      let appointments=[]
      for(let i=0;i<Appointments.length;i++){
        park=await parkdata.getParkById(Appointments[i].parkId.toString());
        activity=await activitydata.get(Appointments[i].activityId.toString())
        date = Appointments[i].month + "/" + Appointments[i].day + "/" + Appointments[i].year
        let myday = new Date()
        let cancel;
        if(Appointments[i].year>myday.getFullYear()) cancel=true
        else if(Appointments[i].year<myday.getFullYear()) cancel=false
        else if(Appointments[i].month>myday.getMonth()+1) cancel=true
        else if(Appointments[i].month<myday.getMonth()+1) cancel=false
        else if(Appointments[i].day>myday.getDate()) cancel=true
        else if(Appointments[i].day<myday.getDate()) cancel=false
        else if(Appointments[i].hour>myday.getHours()) cancel=true
        else if(Appointments[i].hour<=myday.getHours()) cancel=false
        appointments.push({
          appointmentId:Appointments[i]._id,
          parkname:park.name,
          activityname:activity.name,
          date:date,
          time:Appointments[i].hour,
          status:Appointments[i].status,
          cancel:cancel
        })
      }
        res.render('function/Appointment_myAppointment', { data: appointments })
    } catch (e) {
      res.status(500).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  }
});

router.post('/cancelAppointment', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    try {
      var body = req.body;
      let user = await userdata.getUserByEmail(req.session.user.email);
      const deleted = await data.cancelAppointmentById(body.appointmentId);
      res.redirect('/appointments/myAppointment');
    } catch (e) {
      res.status(500).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  }
});

router.get('/newAppointment', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    let parks=await parkdata.getAllParks()
    let activities=await activitydata.getAllactivities()
    res.render('function/Appointment_newAppointment',{parks:parks,activities:activities});
  }
});

router.post('/newAppointment', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    try {
      var body = req.body;
      const user=await userdata.getUserByEmail(req.session.user.email)
      const park=await parkdata.getParksByName(body.park)
      let activity;
      for(let i of park[0].activities){
        if(i.name==body.activity) {
          activity=i;
          break;
        }
      }
      if(!activity) throw "The park doesn't have this activity"
      const year = body.year;
      const month = body.month;
      const day = body.day;
      const hour = body.hour;
      const Appointments = await data.createAppointment(user._id.toString(), park[0]._id.toString(), activity._id.toString(), year, month, day, hour);
      res.redirect('/appointments/myAppointment')
    } catch (e) {
      res.status(500).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  }
});



module.exports = router;