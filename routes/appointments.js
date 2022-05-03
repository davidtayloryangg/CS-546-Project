const express = require('express');
const router = express.Router();
const data = require('../data/appointments');

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
      let Appointments = await data.getAllAppointmentsByCookies(req.session.user.email);
      if (Appointments[0].appointments.length == 0) {
        res.status(404).render('function/Appointment_Error', { error: "You don't have any appointment yet, please match one or create one~", title: "Error" });
        return;
      } else {
        for (x of Appointments[0].appointments) {
          x.parkId = await data.getParknameByParkId(x.parkId);
          x.activityId = await data.getActivitynameByActivityId(x.activityId);
        }
        res.render('function/Appointment_myAppointment', { data: Appointments[0].appointments });
      }
    } catch (e) {
      res.status(404).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  }
});

router.post('/cancelAppointment', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    try {
      var body = req.body;
      let currentUserId = await data.getUserIdbyEmail(req.session.user.email);
      const deleted = await data.cancelAppointmentByAppointmentId(body.appointmentId, currentUserId);
      res.render('function/Appointment_Menu');
    } catch (e) {
      res.status(404).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  }
});

router.get('/newAppointment', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    res.render('function/Appointment_newAppointment');
  }
});

router.post('/creatNewAppointment', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    try {
      var body = req.body;
      const userOneId = await data.getUserIdbyEmail(req.session.user.email);
      const parkId = await data.getParkIdByParkname(body.park);
      const activityId = await data.getActivityIdbyActivitynameandParkname(body.activity, body.park);
      const year = body.year;
      const month = body.month;
      const day = body.day;
      const hour = body.hour;
      const minute = body.minute;
      const Appointments = await data.createAppointment(userOneId, parkId, activityId, year, month, day, hour, minute);
      res.render('function/Appointment_Created', { result: "You have created a new appointment!", title: "Created" });
    } catch (e) {
      res.status(404).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  }
});

router.get('/matchAppointment', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    res.render('function/Appointment_matchAppointment');
  }
});

router.post('/matchNewAppointment', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users');
  } else {
    try {
      var body = req.body;
      const userOneId = await data.getUserIdbyEmail(req.session.user.email);
      const parkId = await data.getParkIdByParkname(body.park);
      const activityId = await data.getActivityIdbyActivitynameandParkname(body.activity, body.park);
      const year = body.year;
      const month = body.month;
      const day = body.day;
      const hour = body.hour;
      const minute = body.minute;
      const AppointmentId = await data.autoMatchId(activityId, parkId, year, month, day, hour, minute);
      const registerAppointment = await data.updateAppointment(AppointmentId, userOneId);
      const Appointment = await data.getAppointmentbyappointmentId(AppointmentId);
      Appointment.parkId = await data.getParknameByParkId(x.parkId);
      Appointment.activityId = await data.getActivitynameByActivityId(x.activityId);
      res.render('function/Appointment_Matched', { data: Appointment, title: "Matched" });
    } catch (e) {
      res.status(404).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  }
});

module.exports = router;