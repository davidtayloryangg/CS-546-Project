// init database
const users = require("../data/users");
const parks = require("../data/parks");
const activities = require("../data/activities");
const appointments = require("../data/appointments");

const dbConnection = require('../config/mongoConnection');
const { getPark, getParkByName } = require("../data/parks");

async function test() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();
  console.log('---------Init Users----------');
  try {
    // create a new user:
    await users.createUser("Yuheng", "Xiao", "yxiao38@stevens.edu", "Xyh123456");
    console.log('create a new user successfully');
  } catch (e) {
    console.error(e);
  }
  console.log('---------Init Parks----------');
  try {
    // create a new park:
    await parks.createPark("Stevens", "9", "5", "Hoboken");
    console.log('create a new park successfully');
  } catch (e) {
    console.error(e);
  }
  console.log('---------Init Activities----------');
  try {
    // create a new activities:
    const park1 = await parks.getParkByName("Stevens");
    await activities.createActivity(
      park1._id,
      "Tennis",
      4,
      8,
      "good"
    );
    console.log('create a new activities successfully');
  } catch (e) {
    console.error(e);
  }
  console.log('---------Init Appointments----------');
  try {
    // create a new appointment:
    const user1 = await
      await appointments.createAppointment("625c0c1d5a60f8da56935094", "625c0c41798d88629ab8fa80", "625c0c2878f2546bb4d9fa5a", "2022", "4", "16", "5", "20");
    console.log('create a new appointment successfully');
  } catch (e) {
    console.error(e);
  }

  try {
    // get All Appointments By ActivityId:
    let appointment = await appointments.getAllAppointmentsByActivityId("625c0c661586419924ffc7f8");
    console.log(appointment);
  } catch (e) {
    console.error(e);
  }

  try {
    // get Appointment by appointmentId:
    let appointment = await appointments.getAppointmentbyappointmentId("625c0cd7e5257c732799fd8f");
    console.log(appointment);
  } catch (e) {
    console.error(e);
  }

  try {
    // AutoMatch and return Id:
    let appointment = await appointments.autoMatchId("625c0c661586419924ffc7f8", "625c0c2878f2546bb4d9fa5a", "2022", "4", "16", "5", "20");
    console.log(appointment);
  } catch (e) {
    console.error(e);
  }

  try {
    // updateAppointment:
    let appointment = await appointments.updateAppointment("625c0e9101fa85df4b2b0ee9");
    console.log(appointment);
  } catch (e) {
    console.error(e);
  }

  await db;
}

test();


