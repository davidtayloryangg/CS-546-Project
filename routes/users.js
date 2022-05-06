const express = require('express');
const router = express.Router();
const userData = require('../data/users');
const parkData = require('../data/parks');
const activityData = require('../data/activities');
const appointmentData=require('../data/appointments');
const func = require('../data/functions');
var xss = require("xss");



router.get('/', async (req, res) => {
  if (req.session.user) res.status(400).redirect('/users/profile');
  else res.status(200).redirect('/users/login');
});

router.get('/login', async (req, res) => {
  if (req.session.user) res.status(400).redirect('/users/profile');
  else res.status(200).render('function/Login')
})

router.post('/login', async (req, res) => {
  try {
    var body = req.body;
    if (!body.email || !body.password) throw "Please provide all input for login!"
    const email = xss(body.email);
    const password = xss(body.password);
    if (!email)
      throw "must provide email";
    if (!password)
      throw "must provide password";

    let userInfo = await userData.checkUser(email, password);
    if (userInfo) {
      var user = {
        name: userInfo.firstname + " " + userInfo.lastname,
        email: userInfo.email,
        userId: userInfo._id,
        permission: userInfo.permission
      }
      req.session.user = user;
    }
    else res.status(400).json({ error: "Didn't provide a valid username and/or password" })
    res.status(200).redirect('/users/profile');
  } catch (e) {
    res.status(500).render('function/Login', { error: e });
  }
});

router.get('/signup', async (req, res) => {
  if (req.session.user) res.status(400).redirect('/users');
  else res.status(200).render('function/Signup')
});

router.post('/signup', async (req, res) => {
  try {
    var body = req.body;
    if (!body.firstname || !body.lastname || !body.email || !body.password) throw "Please provide all input for createUser!";
    const firstname = xss(body.firstname);
    const lastname = xss(body.lastname);
    const email = xss(body.email);
    const password = xss(body.password);
    func.checkUserName(firstname);
    func.checkUserName(lastname);
    func.checkEmail(email);
    func.checkPassword(password);
    // if (!firstname || !lastname || !email || !password)
    //   throw "must provide all inputs";
    let x = await userData.createUser(firstname, lastname, email, password)
    if (x) res.status(200).redirect('/users/login')
    else res.status(500).json({ error: "Internal Server Error" })
  } catch (e) {
    res.status(500).render('function/Signup', { error: e });
  }
});



router.get('/profile', async (req, res) => {
  if (req.session && req.session.user) {
    try {
      const userInfo = req.session.user;
      const user = await userData.getUserByEmail(userInfo.email);
      let park;
      let activity;
      let date;
      let appointment;
      let appointments = []
      for (let i = 0; i < user.appointments.length; i++) {
        appointment=await appointmentData.getAppointmentById(user.appointments[i].toString())
        park=await parkData.getParkById(appointment.parkId.toString())
        activity=await activityData.get(appointment.activityId.toString())
        date = appointment.month + "/" + appointment.day + "/" + appointment.year
        appointmentinfo = {
          park: park.name,
          activity: activity.name,
          date: date,
          time: appointment.hour,
          status: appointment.status
        }
        appointments.push(appointmentinfo)
      };
      let userinfo = {
        id: user._id.toString(),
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        gender: user.gender,
        city: user.city,
        state: user.state,
        age: user.age,
        description: user.description,
        favorites: user.favorites,
        appointments: appointments
      }
      res.status(200).render('function/UserProfile', { user: userinfo, edit: false });
    } catch (e) {
      res.status(500).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  } else {
    res.status(500).redirect('/users/login')
  }
});

router.post('/profile', async (req, res) => {
  if (req.session && req.session.user) {
    try {
      var body = req.body;
      // if (!body.id || !body.email || !body.gender || !body.city || !body.state || !body.age || !body.description) throw "Please provide all input for modifyUserProfile!";
      if (Object.keys(body).length != 1) {
        const id = xss(body.id);
        const email = xss(body.email);
        const gender = xss(body.gender);
        const city = xss(body.city);
        const state = xss(body.state);
        const age = xss(body.age);
        const description = xss(body.description);
        func.checkEmail(email)
        const updated = await userData.modifyUserProfile(id, email, gender, city, state, age, description);
        if (updated) {
          res.status(200).redirect("/users/profile")
        }
      } else {
        const user = await userData.getUserById(body.id)
        const bodyid = xss(body.id);
        let userinfo = {
          id: bodyid,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          gender: user.gender,
          city: user.city,
          state: user.state,
          age: user.age,
          description: user.description,
          favorites: user.favorites,
          appointments: user.appointments
        }
        res.status(200).render('function/UserProfile', { user: userinfo, edit: true })
      }
    } catch (e) {
      res.status(500).render('function/Appointment_Error', { error: e, title: "Error" });
    }
  } else {
    res.status(400).redirect('/users/login')
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.status(200).redirect("/users/login")
});

module.exports = router;