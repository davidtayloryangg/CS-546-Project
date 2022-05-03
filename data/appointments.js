// Appointments is a sub-document
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const parks = mongoCollections.parks;
let { ObjectId } = require('mongodb');
const res = require('express/lib/response');
const { getUserByEmail,getUserById } = require('./users');

module.exports = {
  async createAppointment(userOneId, parkId, activityId, year, month, day, hour, minute) {
    if (!userOneId || !parkId || !activityId || !year || !month || !day || !hour || !minute) throw 'please provide all inputs for appointment';
    if (!ObjectId.isValid(userOneId)) throw 'invalid user ID';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    if (!ObjectId.isValid(activityId)) throw 'invalid park ID';
    if (typeof year !== 'string' || year.trim().length === 0 || isNaN(parseInt(year)) || parseInt(year) < new Date().getFullYear()) throw "invalid year or the year was past";
    if (typeof month !== 'string' || month.trim().length === 0 || isNaN(parseInt(month))) throw "invalid month or the month was past";
    if (typeof day !== 'string' || day.trim().length === 0 || isNaN(parseInt(day))) throw "invalid day or the day was past";
    if (typeof hour !== 'string' || hour.trim().length === 0 || isNaN(parseInt(hour)) || parseInt(hour) < 0 || parseInt(hour) > 23) throw "invalid hour";

    // Checking the current time is occupied or not:
    activityId = ObjectId(activityId);
    parkId = ObjectId(parkId);

    const checkuserCollection = await users();
    const checkavalibleappointment = await checkuserCollection.findOne({ "appointments.parkId": parkId, "appointments.activityId": activityId, "appointments.year": year, "appointments.month": month, "appointments.day": day, "appointments.hour": hour });
    if (checkavalibleappointment != null) {
      throw 'This schedule has been created by others, you can try to match this time directly!'
    }

    // Getting the maxpeople
    const maxpeopelCollection = await parks();
    let maxpoepleappointment = await maxpeopelCollection.find({ "_id": parkId }).toArray();
    if (maxpoepleappointment === null) throw 'Cannot get maxpeople in your selected park and activity!';
    let maxPeople;
    for (x of maxpoepleappointment[0].activities) {
      if (x._id.equals(activityId)) {
        maxPeople = x.maxPeople;
        break;
      }
    }

    // Creating new appointment if current time is not occupied:
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
      maxPeople: maxPeople,
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

  async getUserIdbyEmail(email) {
    if (typeof email === 'undefined') throw "email is undefined!";
    if (typeof email !== 'string') throw "email is not a string!"
    if (typeof email === 'string' && email.trim().length === 0) throw "email is an empty string!";

    const userCollection = await users();
    let allappointments = await userCollection.find({ "email": email }).toArray();
    if (allappointments === null) throw 'No user with that email!';
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments[0]._id;
  },

  async getParknameByParkId(ParkId) {
    if (typeof ParkId === 'undefined') throw "ParkId is undefined!";
    if (!ObjectId.isValid(ParkId) && typeof ParkId !== 'string') throw "ParkId is not a string or objectKey!"
    if (typeof ParkId === 'string' && ParkId.trim().length === 0) throw "ParkId is an empty string!";
    if (!ObjectId.isValid(ParkId)) {
      throw "ParkId doesn't exist!";
    } else {
      ParkId = ObjectId(ParkId);
    }

    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "_id": ObjectId(ParkId) }).toArray();
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments[0].name;
  },

  async getParkIdByParkname(Parkname) {
    if (typeof Parkname === 'undefined') throw "Parkname is undefined!";
    if (typeof Parkname === 'string' && Parkname.trim().length === 0) throw "Parkname is an empty string!";

    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "name": Parkname }).toArray();
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments[0]._id;
  },

  async getActivitynameByActivityId(activityId) {
    if (typeof activityId === 'undefined') throw "activityId is undefined!";
    if (!ObjectId.isValid(activityId) && typeof activityId !== 'string') throw "activityId is not a string or objectKey!"
    if (typeof activityId === 'string' && activityId.trim().length === 0) throw "activityId is an empty string!";
    if (!ObjectId.isValid(activityId)) {
      throw "activityId doesn't exist!";
    } else {
      activityId = ObjectId(activityId);
    }

    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "activities._id": ObjectId(activityId) }).toArray();
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    let result;
    for (x of allappointments[0].activities) {
      if ((x._id).equals(activityId)) {
        result = x.name;
      }
    }
    return result;
  },

  async getActivityIdbyActivitynameandParkname(Activityname, Parkname) {
    if (typeof Activityname === 'undefined') throw "Activityname is undefined!";
    if (typeof Activityname !== 'string') throw "Activityname is not a string!"
    if (typeof Activityname === 'string' && Activityname.trim().length === 0) throw "Activityname is an empty string!";
    if (typeof Parkname === 'undefined') throw "Parkname is undefined!";
    if (typeof Parkname !== 'string') throw "Parkname is not a string!"
    if (typeof Parkname === 'string' && Parkname.trim().length === 0) throw "Parkname is an empty string!";

    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "name": Parkname }).toArray();
    if (allappointments === null) throw 'Your selected park without that activity!';
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    let result;
    for (x of allappointments[0].activities) {
      if (x.name == Activityname) {
        result = x._id;
      }
    }
    if (result == null) throw `${Parkname} don't have ${Activityname} yet! Please create ${Activityname} for ${Parkname} in activity page first~`
    return result;
  },

  async getAllAppointmentsByActivityId(activityId) {
    if (typeof activityId === 'undefined') throw "activityId is undefined!";
    if (!ObjectId.isValid(activityId) && typeof activityId !== 'string') throw "activityId is not a string or objectKey!"
    if (typeof activityId === 'string' && activityId.trim().length === 0) throw "activityId is an empty string!";
    if (!ObjectId.isValid(activityId)) {
      throw "activityId doesn't exist!";
    } else {
      activityId = ObjectId(activityId);
    }

    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "activities._id": ObjectId(activityId) }).toArray();
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments;
  },

  async getAllAppointmentsByUserId(userId) {
    if (typeof userId === 'undefined') throw "userId is undefined!";
    if (!ObjectId.isValid(userId) && typeof userId !== 'string') throw "userId is not a string or objectKey!"
    if (typeof userId === 'string' && userId.trim().length === 0) throw "userId is an empty string!";
    if (!ObjectId.isValid(userId)) {
      throw "userId doesn't exist!";
    } else {
      userId = ObjectId(userId);
    }

    const userCollection = await users();
    let allappointments = await userCollection.find({ "_id": ObjectId(userId) }).toArray();
    if (allappointments === null) throw 'No user with that userId!';
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments;
  },

  async getAllAppointmentsByCookies(email) {
    if (typeof email === 'undefined') throw "email is undefined!";
    if (typeof email !== 'string') throw "email is not a string!"
    if (typeof email === 'string' && email.trim().length === 0) throw "email is an empty string!";

    const userCollection = await users();
    let allappointments = await userCollection.find({ "email": email }).toArray();
    if (allappointments === null) throw 'No user with that email!';
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
    // return appointment;

    let result;
    for (x of appointment.appointments) {
      if ((x.appointmentId).equals(appointmentId)) {
        result = x;
        break;
      }
    }
    return result;
  },

  async autoMatchId(activityId, parkId, year, month, day, hour, minute) {
    if (!activityId || !parkId || !year || !month || !day || !hour || !minute) throw 'please provide all inputs to match';
    if (!ObjectId.isValid(activityId)) throw 'invalid acitivity ID';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    if (typeof year !== 'string' || year.trim().length === 0 || isNaN(parseInt(year)) || parseInt(year) < new Date().getFullYear()) throw "invalid year or the year was past";
    if (typeof month !== 'string' || month.trim().length === 0 || isNaN(parseInt(month)) || parseInt(month) < new Date().getMonth()) throw "invalid month or the month was past";
    if (typeof day !== 'string' || day.trim().length === 0 || isNaN(parseInt(day)) || parseInt(day) < new Date().getDay()) throw "invalid day or the day was past";
    if (typeof hour !== 'string' || hour.trim().length === 0 || isNaN(parseInt(hour)) || parseInt(hour) < 0 || parseInt(hour) > 23) throw "invalid hour";
    if (typeof minute !== 'string' || minute.trim().length === 0 || parseInt(minute) < 0 || parseInt(minute) > 59) throw "invalid minute";

    activityId = ObjectId(activityId);
    parkId = ObjectId(parkId);

    const userCollection = await users();
    const avalibleappointment = await userCollection.findOne({ "appointments.parkId": parkId, "appointments.activityId": activityId, "appointments.year": year, "appointments.month": month, "appointments.day": day, "appointments.hour": hour, "appointments.approvement": false });
    if (avalibleappointment === null) throw 'No avalible appointment, you can creat a new appointment!';
    // return avalibleappointment;

    let appointmentId;
    for (x of avalibleappointment.appointments) {
      if ((x.parkId).equals(parkId) && (x.activityId).equals(activityId) && x.year == year && x.month == month && x.day == day && x.approvement == false) {
        appointmentId = x.appointmentId;
      }
    }
    return appointmentId;
  },

  async cancelAppointmentByAppointmentId(appointmentId, currentUserId) {
    if (typeof appointmentId === 'undefined') throw "appointmentId is undefined!";
    if (!ObjectId.isValid(appointmentId) && typeof appointmentId !== 'string') throw "appointmentId is not a string or objectKey!"
    if (!ObjectId.isValid(appointmentId)) {
      throw "appointmentId doesn't exist!";
    } else {
      appointmentId = ObjectId(appointmentId);
    }
    if (typeof currentUserId === 'undefined') throw "currentUserId is undefined!";
    if (!ObjectId.isValid(currentUserId) && typeof currentUserId !== 'string') throw "currentUserId is not a string or objectKey!"
    if (typeof currentUserId === 'string' && currentUserId.trim().length === 0) throw "currentUserId is an empty string!";
    if (!ObjectId.isValid(currentUserId)) {
      throw "currentUserId doesn't exist!";
    } else {
      currentUserId = ObjectId(currentUserId);
    }

    const userCollection = await users();
    let user = await userCollection.findOne({ "_id": ObjectId(currentUserId) });
    if (user === null) throw "Cannot find the user!";

    userCollection.updateOne(
      { "_id": ObjectId(currentUserId) },
      { $pull: { appointments: { appointmentId: appointmentId } } }
    );

  },

  async updateAppointment(appointmentId, currentUserId) {
    if (typeof appointmentId === 'undefined') throw "appointmentId is undefined!";
    if (!ObjectId.isValid(appointmentId) && typeof appointmentId !== 'string') throw "appointmentId is not a string or objectKey!"
    if (typeof appointmentId === 'string' && appointmentId.trim().length === 0) throw "appointmentId is an empty string!";
    if (!ObjectId.isValid(appointmentId)) {
      throw "appointmentId doesn't exist!";
    } else {
      appointmentId = ObjectId(appointmentId);
    }
    if (typeof currentUserId === 'undefined') throw "currentUserId is undefined!";
    if (!ObjectId.isValid(currentUserId) && typeof currentUserId !== 'string') throw "currentUserId is not a string or objectKey!"
    if (typeof currentUserId === 'string' && currentUserId.trim().length === 0) throw "currentUserId is an empty string!";
    if (!ObjectId.isValid(currentUserId)) {
      throw "currentUserId doesn't exist!";
    } else {
      currentUserId = ObjectId(currentUserId);
    }

    const userCollection = await users();
    let user = await userCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
    if (user === null) throw 'No appointment with that appointmentId';
    if (user._id.equals(currentUserId)) throw "You cannot register your own appointment!"

    // Get the current number of people in this appointment:
    let currentPeople;
    for (x of user.appointments) {
      if (x.appointmentId.equals(appointmentId)) {
        currentPeople = x.maxPeople - 1;
        break;
      }
    }

    // If this appointment is full(currentPeople == 0):
    if (currentPeople <= 0) throw "This appointment is full, Can not register it!";

    // If this appointment has more than 1 spot left(currentPeople > 1):
    if (currentPeople > 1) {
      userCollection.updateOne(
        { "appointments.appointmentId": ObjectId(appointmentId) },
        { $set: { "appointments.$[filter].maxPeople": currentPeople - 1 } },
        { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
      );
      userCollection.updateOne(
        { "appointments.appointmentId": ObjectId(appointmentId) },
        { $set: { "appointments.$[filter].status": `${currentPeople - 1} people left` } },
        { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
      );

      let newuser = await userCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
      if (newuser === null) throw 'No appointment with that appointmentId';
      let newAppointment;
      let allAppointments = newuser.appointments;
      for (let x of allAppointments) {
        if (x.appointmentId.equals(appointmentId)) {
          newAppointment = x;
          break;
        }
      }
      const updatesecondUser = await userCollection.updateOne({ _id: ObjectId(currentUserId) },
        { $addToSet: { appointments: newAppointment } }
      );

      const parkCollection = await parks();
      let park = await parkCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
      if (park === null) throw 'No appointment with that appointmentId';
      parkCollection.updateOne(
        { "appointments.appointmentId": ObjectId(appointmentId) },
        { $set: { "appointments.$[filter].maxPeople": currentPeople - 1 } },
        { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
      );
      parkCollection.updateOne(
        { "appointments.appointmentId": ObjectId(appointmentId) },
        { $set: { "appointments.$[filter].status": `${currentPeople - 1} people left` } },
        { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
      );
      return true;
    }

    // If this appointment only 1 spot left(currentPeople == 1):
    if (currentPeople == 1) {
      userCollection.updateOne(
        { "appointments.appointmentId": ObjectId(appointmentId) },
        { $set: { "appointments.$[filter].maxPeople": currentPeople - 1 } },
        { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
      );
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

      let newuser = await userCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
      if (newuser === null) throw 'No appointment with that appointmentId';
      let newAppointment;
      let allAppointments = newuser.appointments;
      for (let x of allAppointments) {
        if (x.appointmentId.equals(appointmentId)) {
          newAppointment = x;
          break;
        }
      }
      const updatesecondUser = await userCollection.updateOne({ _id: ObjectId(currentUserId) },
        { $addToSet: { appointments: newAppointment } }
      );

      const parkCollection = await parks();
      let park = await parkCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
      if (park === null) throw 'No appointment with that appointmentId';
      parkCollection.updateOne(
        { "appointments.appointmentId": ObjectId(appointmentId) },
        { $set: { "appointments.$[filter].maxPeople": currentPeople - 1 } },
        { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
      );
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

}
