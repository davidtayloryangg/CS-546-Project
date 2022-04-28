const express = require('express');
const router = express.Router();
const data = require('../data/appointments');

router
  .route('/appointments')
  .get(async (req, res) => {
    let Info = req.body;
    try {
      const Appointments = await data.getAllAppointmentsByActivityId(Info);
      res.json(Appointments);
    } catch (e) {
      res.status(500).json(e);
    }
  })
  .post(async (req, res) => {
    let Info = req.body;
    try {
      const newAppointment = await data.createAppointment(
        Info.userOneId,
        Info.parkId,
        Info.activityId,
        Info.year,
        Info.month,
        Info.day,
        Info.hour,
        Info.minute
      );
      res.status(200).json(newAppointment);
    } catch (e) {
      res.status(400).json(e);
    }
  });

  router
  .route('/appointments/recommendation')
  .post(async (req, res) => {
    let Info = req.body;
    try {
      const newMatch = await data.autoMatchId(
        Info.activityId,
        Info.parkId,
        Info.year,
        Info.month,
        Info.day,
        Info.hour,
        Info.minute
      );
      res.status(200).json(newMatch);
    } catch (e) {
      res.status(400).json(e);
    }
  });


  module.exports = router;