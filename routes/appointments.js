const express = require('express');
const router = express.Router();
const data = require('../data/appointments');

router.get('/', async (req, res) => {
  if (!req.session.user){
    res.redirect('/users');
  } else{
    res.render('function/Appointment_Menu');
  }
});

router.get('/myAppointment', async (req, res) => {
  if (!req.session.user){
    res.redirect('/users');
  } else{
    try {
      let Appointments = await data.getAllAppointmentsByCookies(req.session.user);
      if (Appointments[0].appointments.length == 0){
        res.status(404).render('function/Appointment_Error',{ error: "You don't have any appointment yet, please match one or create one~", title: "Error"});
        return;
      } else{
        res.render('function/Appointment_myAppointment', {data: Appointments[0].appointments});
      }
    } catch (e) {
      res.status(404).render('function/Appointment_Error',{ error: e, title: "Error"});
    }
  }
});

router.get('/newAppointment', async (req, res) => {
  if (!req.session.user){
    res.redirect('/users');
  } else{
    res.render('function/newAppointment');
  }
});

router.post('/creatNewAppointment', async (req, res) => {
  if (!req.session.user){
    res.redirect('/users');
  } else{
    try {
      var body = req.body;
      const userOneId = await data.getUserIdbyEmail(req.session.user);
      const parkId = body.parkId;
      const activityId = body.activityId;
      const year = body.year;
      const month = body.month;
      const day = body.day;
      const hour = body.hour;
      const minute = body.minute;
      const Appointments = await data.createAppointment(userOneId, parkId, activityId, year, month, day, hour, minute);
    } catch (e) {
      res.status(404).render('function/Appointment_Error',{ error: e, title: "Error"});
    }
  }
});

// router
//   .route('/appointments')
//   .get(async (req, res) => {
//     let Info = req.body;
//     try {
//       const Appointments = await data.getAllAppointmentsByActivityId(Info);
//       res.json(Appointments);
//     } catch (e) {
//       res.status(500).json(e);
//     }
//   })
//   .post(async (req, res) => {
//     let Info = req.body;
//     try {
//       const newAppointment = await data.createAppointment(
//         Info.userOneId,
//         Info.parkId,
//         Info.activityId,
//         Info.year,
//         Info.month,
//         Info.day,
//         Info.hour,
//         Info.minute
//       );
//       res.status(200).json(newAppointment);
//     } catch (e) {
//       res.status(400).json(e);
//     }
//   });

//   router
//   .route('/appointments/recommendation')
//   .post(async (req, res) => {
//     let Info = req.body;
//     try {
//       const newMatch = await data.autoMatchId(
//         Info.activityId,
//         Info.parkId,
//         Info.year,
//         Info.month,
//         Info.day,
//         Info.hour,
//         Info.minute
//       );
//       res.status(200).json(newMatch);
//     } catch (e) {
//       res.status(400).json(e);
//     }
//   });


  module.exports = router;