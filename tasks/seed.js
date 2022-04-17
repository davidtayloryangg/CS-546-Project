// init database
const users = require("../data/users");
const parks = require("../data/parks");
const activities = require("../data/activities");
const appointments = require("../data/appointments");
const comments = require("../data/comments");
const reviews = require("../data/reviews");

const dbConnection = require('../config/mongoConnection');
const { getPark, getParkByName } = require("../data/parks");

async function test() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  console.log('------------Init Users------------');
  const user1 = await users.createUser("Yuheng", "Xiao", "yxiao38@stevens.edu", "Xyh123456");
  const user2 = await users.createUser("Yue", "Qin", "qinyue12345@gmail.com", "qinyue12345");
  console.log('------------create users successfully------------');

  console.log('------------Init Parks------------');
  const park1 = await parks.createPark("Stevens", "9", "5", "Hoboken");
  console.log('------------create parks successfully------------');

  console.log('------------Init Activities------------');
  // create a new activities:
  const activity1 = await activities.createActivity(park1._id, "Tennis", 4, 8);
  console.log('------------create activities successfully------------');

  console.log('------------Init Appointments------------');
  const appointment1 = await appointments.createAppointment(user1._id, park1._id, activity1._id, "2022", "4", "16", "5", "20");
  console.log('------------create appointments successfully------------');

  console.log('------------Init Comments------------');
  const comment1 = await comments.createComment(park1._id, 4.55, "nice park!");
  console.log('------------create comments successfully------------');

  console.log('------------Init Reviews------------');
  const review1 = await reviews.createReview(user1._id, "nice!!!!!");
  console.log('------------create reviews successfully------------');

  // try {
  //   // get All Appointments By ActivityId:
  //   const Activity = await activities.get()
  //   const appointment = await appointments.getAllAppointmentsByActivityId("625c0c661586419924ffc7f8");
  //   console.log(appointment);
  // } catch (e) {
  //   console.error(e);
  // }

  // try {
  //   // get Appointment by appointmentId:
  //   const appointment = await appointments.getAppointmentbyappointmentId("625c0cd7e5257c732799fd8f");
  //   console.log(appointment);
  // } catch (e) {
  //   console.error(e);
  // }

  // try {
  //   // AutoMatch and return Id:
  //   let appointment = await appointments.autoMatchId("625c0c661586419924ffc7f8", "625c0c2878f2546bb4d9fa5a", "2022", "4", "16", "5", "20");
  //   console.log(appointment);
  // } catch (e) {
  //   console.error(e);
  // }

  // try {
  //   // updateAppointment:
  //   let appointment = await appointments.updateAppointment("625c0e9101fa85df4b2b0ee9");
  //   console.log(appointment);
  // } catch (e) {
  //   console.error(e);
  // }

  await dbConnection.closeConnection();
}

test();