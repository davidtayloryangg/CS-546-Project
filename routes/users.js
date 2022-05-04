const express = require('express');
const router = express.Router();
const userData = require('../data/users');
const parkData = require('../data/parks');
const activityData = require('../data/activities');



router.get('/', async (req, res) => {
  if (req.session.user) res.redirect('/users/profile');
  else res.redirect('/users/login');
});

router.get('/login', async (req, res) => {
  if (req.session.user) res.redirect('/users/profile');
  else res.render('function/Login')
})

router.post('/login', async (req, res) => {
  var body = req.body;
  const email = body.email;
  const password = body.password;
  try {
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
    res.redirect('/users/profile');
  } catch (e) {
    res.status(400).render('function/Login', { error: e });
  }
});

router.get('/signup', async (req, res) => {
  if (req.session.user) res.redirect('/users');
  else res.render('function/Signup')
});

router.post('/signup', async (req, res) => {
  var body = req.body;
  const firstname = body.firstname;
  const lastname = body.lastname;
  const email = body.email;
  const password = body.password;
  try {
    if (!firstname || !lastname || !email || !password)
      throw "must provide all inputs";
    let x = await userData.createUser(firstname, lastname, email, password)
    if (x) res.redirect('/users/login')
    else res.status(500).json({ error: "Internal Server Error" })
  } catch (e) {
    res.status(400).render('function/Signup', { error: e });
  }
});



router.get('/profile', async (req, res) => {
  if (req.session && req.session.user) {
    const userInfo = req.session.user;
    const user = await userData.getUserByEmail(userInfo.email);
    let park;
    let activity;
    let date;
    let time;
    let appointment;
    let appointments = []
    for (let i = 0; i < user.appointments.length; i++) {
      park = await parkData.getParkById(user.appointments[i].parkId.toString())
      activity = await activityData.get(user.appointments[i].activityId.toString())
      date = user.appointments[i].month + "/" + user.appointments[i].day + "/" + user.appointments[i].year
      time = user.appointments[i].hour + ":" + user.appointments[i].minute
      appointment = {
        park: park.name,
        activity: activity.name,
        date: date,
        time: time,
        status: user.appointments[i].status
      }
      appointments.push(appointment)
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
    res.render('function/UserProfile', { user: userinfo, edit: false });
  } else {
    res.redirect('/users/login')
  }
});

router.post('/profile', async (req, res) => {
  if (req.session && req.session.user) {
    var body = req.body;
    if (Object.keys(body).length != 1) {
      const id = body.id;
      const email = body.email;
      const gender = body.gender;
      const city = body.city;
      const state = body.state;
      const age = body.age;
      const description = body.description;
      const updated = await userData.modifyUserProfile(id, email, gender, city, state, age, description);
      if (updated) {
        res.render('function/UserProfile', { user: body, edit: false })
      }
    } else {
      const user = await userData.getUserById(body.id)
      let park;
      let activity;
      let date;
      let time;
      let appointment;
      let appointments = []
      for (let i = 0; i < user.appointments.length; i++) {
        park = await parkData.getParkById(user.appointments[i].parkId.toString())
        activity = await activityData.get(user.appointments[i].activityId.toString())
        date = user.appointments[i].month + "/" + user.appointments[i].day + "/" + user.appointments[i].year
        time = user.appointments[i].hour + ":" + user.appointments[i].minute
        appointment = {
          park: park.name,
          activity: activity.name,
          date: date,
          time: time,
          status: user.appointments[i].status
        }
        appointments.push(appointment)
      };
      let userinfo = {
        id: body.id,
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
      res.render('function/UserProfile', { user: userinfo, edit: true })
    }
  } else {
    res.redirect('/users/login')
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect("/users/login")
});

module.exports = router;