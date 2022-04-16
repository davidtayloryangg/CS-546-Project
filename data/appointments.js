// Appointments is a sub-document
const mongoCollections = require('../config/mongoCollections');
const appointments = mongoCollections.appointments;
let { ObjectId } = require('mongodb');

module.exports = {
  async createAppointment(userOneId, activityId, parkId, year, month, day, hour, minute) {
    if (!userOneId || !activityId || !parkId || !year || !month || !day || !hour || !minute) throw 'please provide all inputs';
    if (!ObjectId.isValid(userOneId))  throw 'invalid user ID';
    if (!ObjectId.isValid(activityId)) throw 'invalid acitivity ID';
    if (!ObjectId.isValid(parkId))     throw 'invalid park ID';
    if (typeof year !== 'string' || year.trim().length === 0  || isNaN(parseInt(year)) || parseInt(year)  < new Date().getFullYear()) throw "invalid year or the year was past";
    if (typeof month !== 'string'|| month.trim().length === 0 || isNaN(parseInt(month))|| parseInt(month) < new Date().getMonth())    throw "invalid month or the month was past";
    if (typeof day !== 'string'  || day.trim().length === 0   || isNaN(parseInt(day))  || parseInt(day) < new Date().getDay())        throw "invalid day or the day was past";
    if (typeof hour !== 'string' || hour.trim().length === 0  || isNaN(parseInt(hour)) || parseInt(hour) < 0 || parseInt(hour) > 23)  throw "invalid hour";
    if (typeof minute !=='string'|| minute.trim().length === 0|| parseInt(minute) < 0  || parseInt(minute) > 59)                      throw "invalid minute";

    let newAppointment = {
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
    
    const appointmentsCollection = await appointments();
    const insertInfo = await appointmentsCollection.insertOne(newAppointment);
    if (insertInfo.insertedCount === 0) throw "Could not add a new appiontment";
    const appointmentId = insertInfo.insertedId;
    const appiontment = await get(appointmentId);
  },

  async getAllAppointments() {
    const appointmentsCollection = await appointments();
    let allappointments = await appointmentsCollection.find({}).toArray();
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments;
  },

  async getAppointmentbyId(id){
    if (typeof id === 'undefined') throw "id is undefined!";
    if (!ObjectId.isValid(id) && typeof id !== 'string') throw "id is not a string or objectKey!"
    if (typeof id === 'string' && id.trim().length === 0) throw "id is an empty string!";  
    if (!ObjectId.isValid(id)){
        throw "ID doesn't exist!";
    } else{
        id = ObjectId(id);
    }

    const appointmentsCollection = await appointments();
    const appointment = await appointmentsCollection.findOne({_id: id});
    if (appointment === null) throw 'No appointment with that id!';
    return appointment;
  },

  async autoMatchId(activityId, parkId, year, month, day, hour, minute){
    if (!activityId || !parkId || !year || !month || !day || !hour || !minute) throw 'please provide all inputs';
    if (!ObjectId.isValid(activityId)) throw 'invalid acitivity ID';
    if (!ObjectId.isValid(parkId))     throw 'invalid park ID';
    if (typeof year !== 'string' || year.trim().length === 0  || isNaN(parseInt(year)) || parseInt(year)  < new Date().getFullYear()) throw "invalid year or the year was past";
    if (typeof month !== 'string'|| month.trim().length === 0 || isNaN(parseInt(month))|| parseInt(month) < new Date().getMonth())    throw "invalid month or the month was past";
    if (typeof day !== 'string'  || day.trim().length === 0   || isNaN(parseInt(day))  || parseInt(day) < new Date().getDay())        throw "invalid day or the day was past";
    if (typeof hour !== 'string' || hour.trim().length === 0  || isNaN(parseInt(hour)) || parseInt(hour) < 0 || parseInt(hour) > 23)  throw "invalid hour";
    if (typeof minute !=='string'|| minute.trim().length === 0|| parseInt(minute) < 0  || parseInt(minute) > 59)                      throw "invalid minute";

    activityId = ObjectId(activityId);
    parkId = ObjectId(parkId);

    const appointmentsCollection = await appointments();
    const avalibleappointment = await appointmentsCollection.findOne({activityId: activityId, parkId: parkId, year: year, month: month, day: day, hour: hour, minute: minute, approvement: false});
    if (avalibleappointment === null) throw 'No avalible appointment, you can creat a new appointment!';
    return avalibleappointment.userOneId;
  },

  async updateAppointment(id){
    if (typeof id === 'undefined') throw "id is undefined!";
    if (!ObjectId.isValid(id) && typeof id !== 'string') throw "id is not a string or objectKey!"
    if (typeof id === 'string' && id.trim().length === 0) throw "id is an empty string!";  
    if (!ObjectId.isValid(id)){
        throw "ID doesn't exist!";
    } else{
        id = ObjectId(id);
    }
  
    const appointmentsCollection = await appointments();
    const updatedappointment = {
      userOneId: userOneId,
      parkId: parkId,
      activityId: activityId,
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      approvement: true,
      status: "Full"
    };
    const updatedInfo = await appointmentsCollection.updateOne({_id: id}, {$set: updatedappointment});
    if (updatedInfo.modifiedCount === 0) {
      throw 'could not update the appointment!';
    }
    return await get(id);
  }

}
