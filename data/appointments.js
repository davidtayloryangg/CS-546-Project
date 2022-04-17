// Appointments is a sub-document
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const parks = mongoCollections.parks;
let { ObjectId } = require('mongodb');

module.exports = {
  async createAppointment(userOneId, parkId, activityId, year, month, day, hour, minute) {
    if (!userOneId || !parkId || !activityId || !year || !month || !day || !hour || !minute) throw 'please provide all inputs';
    if (!ObjectId.isValid(userOneId)) throw 'invalid user ID';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    if (!ObjectId.isValid(activityId)) throw 'invalid park ID';
    if (typeof year !== 'string' || year.trim().length === 0 || isNaN(parseInt(year)) || parseInt(year) < new Date().getFullYear()) throw "invalid year or the year was past";
    if (typeof month !== 'string' || month.trim().length === 0 || isNaN(parseInt(month)) || parseInt(month) < new Date().getMonth()) throw "invalid month or the month was past";
    if (typeof day !== 'string' || day.trim().length === 0 || isNaN(parseInt(day)) || parseInt(day) < new Date().getDay()) throw "invalid day or the day was past";
    if (typeof hour !== 'string' || hour.trim().length === 0 || isNaN(parseInt(hour)) || parseInt(hour) < 0 || parseInt(hour) > 23) throw "invalid hour";
    if (typeof minute !== 'string' || minute.trim().length === 0 || parseInt(minute) < 0 || parseInt(minute) > 59) throw "invalid minute";

    const newId = ObjectId();
    let newAppointment = {
      appointmentId: newId,
      userOneId: userOneId,
      parkId: parkId,
      activityId: activityId,
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      approvement: false,
      status: "Not matched"
    };

    const userCollection = await users();
    const updateUser = await userCollection.updateOne({ _id: ObjectId(userOneId) },
      { $addToSet: { appointments: newAppointment } }
    );
    if (!updateUser.matchedCount && !updateUser.modifiedCount)
      throw 'Could not add a new appintment to User';

    const parkCollection = await parks();
    const updateActivity = await parkCollection.updateOne({ "activities._id": ObjectId(activityId) },
      { $addToSet: { appointments: newAppointment } }
    );
    if (!updateActivity.matchedCount && !updateActivity.modifiedCount)
      throw 'Could not add a new appintment to Activity';
    return newAppointment;
  },

  async getAllAppointmentsByActivityId(activityId) {
    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "activities._id": ObjectId(activityId) }).toArray();
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments;
  },

  async getAppointmentbyappointmentId(appointmentId) {
    if (typeof appointmentId === 'undefined') throw "appointmentId is undefined!";
    if (!ObjectId.isValid(appointmentId) && typeof appointmentId !== 'string') throw "appointmentId is not a string or objectKey!"
    if (typeof appointmentId === 'string' && appointmentId.trim().length === 0) throw "appointmentId is an empty string!";
    if (!ObjectId.isValid(appointmentId)) {
      throw "appointmentId doesn't exist!";
    } else {
      appointmentId = ObjectId(appointmentId);
    }

    const userCollection = await users();
    const appointment = await userCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
    if (appointment === null) throw 'No appointment with that appointmentId!';
    return appointment;
  },

  async autoMatchId(activityId, parkId, year, month, day, hour, minute) {
    if (!activityId || !parkId || !year || !month || !day || !hour || !minute) throw 'please provide all inputs';
    if (!ObjectId.isValid(activityId)) throw 'invalid acitivity ID';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    if (typeof year !== 'string' || year.trim().length === 0 || isNaN(parseInt(year)) || parseInt(year) < new Date().getFullYear()) throw "invalid year or the year was past";
    if (typeof month !== 'string' || month.trim().length === 0 || isNaN(parseInt(month)) || parseInt(month) < new Date().getMonth()) throw "invalid month or the month was past";
    if (typeof day !== 'string' || day.trim().length === 0 || isNaN(parseInt(day)) || parseInt(day) < new Date().getDay()) throw "invalid day or the day was past";
    if (typeof hour !== 'string' || hour.trim().length === 0 || isNaN(parseInt(hour)) || parseInt(hour) < 0 || parseInt(hour) > 23) throw "invalid hour";
    if (typeof minute !== 'string' || minute.trim().length === 0 || parseInt(minute) < 0 || parseInt(minute) > 59) throw "invalid minute";

    // activityId = ObjectId(activityId);
    // parkId = ObjectId(parkId);

    const userCollection = await users();
    const avalibleappointment = await userCollection.findOne({ "appointments.activityId": activityId, "appointments.parkId": parkId, "appointments.year": year, "appointments.month": month, "appointments.day": day, "appointments.hour": hour, "appointments.approvement": false });
    if (avalibleappointment === null) throw 'No avalible appointment, you can creat a new appointment!';
    return avalibleappointment;
  },

  async updateAppointment(appointmentId) {
    if (typeof appointmentId === 'undefined') throw "appointmentId is undefined!";
    if (!ObjectId.isValid(appointmentId) && typeof appointmentId !== 'string') throw "appointmentId is not a string or objectKey!"
    if (typeof appointmentId === 'string' && appointmentId.trim().length === 0) throw "appointmentId is an empty string!";
    if (!ObjectId.isValid(appointmentId)) {
      throw "appointmentId doesn't exist!";
    } else {
      appointmentId = ObjectId(appointmentId);
    }

    // const userCollection = await users();
    // let user = await userCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
    // if (user === null) throw 'No appointment with that appointmentId';
    // const updateInfo = await userCollection.updateOne({"appointments.appointmentId": ObjectId(appointmentId)}, {$add: {appointmens: {approvement: true, status: "Full"}}});
    // if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    //   throw 'Could register that appointment';

    const userCollection = await users();
    let user = await userCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
    if (user === null) throw 'No appointment with that appointmentId';
    userCollection.updateOne(
      { "appointments.appointmentId": ObjectId(appointmentId) },
      { $set: { "appointments.$[filter].approvement": true } },
      { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
    );
    userCollection.updateOne(
      { "appointments.appointmentId": ObjectId(appointmentId) },
      { $set: { "appointments.$[filter].status": "Full" } },
      { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
    );

    const parkCollection = await parks();
    let park = await parkCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
    if (park === null) throw 'No appointment with that appointmentId';
    parkCollection.updateOne(
      { "appointments.appointmentId": ObjectId(appointmentId) },
      { $set: { "appointments.$[filter].approvement": true } },
      { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
    );
    parkCollection.updateOne(
      { "appointments.appointmentId": ObjectId(appointmentId) },
      { $set: { "appointments.$[filter].status": "Full" } },
      { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
    );
    return true;
  }

}
