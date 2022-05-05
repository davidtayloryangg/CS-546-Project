// Appointments is a sub-document
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const appointments=mongoCollections.appointments;
let { ObjectId } = require('mongodb');
const { getUserByEmail, getUserById } = require('./users');
const {getParkById}=require('./parks')
const activitydata=require('./activities')

function checkString(string){
  if (typeof(string)!='string') throw 'parameter is not a string';
  if (string.length===0) throw 'string is empty'; 
  if(string.trim()==='') throw'parameter is error'
}

function checktime(month,day,year,hour){
  if(typeof(month)!='number') 
  {
      checkString(month);
      month=month.trim()
      month=Number(month)
  }
  if(typeof(day)!='number') 
  {
      checkString(day);
      day=day.trim()
      day=Number(day)
  }
  if(typeof(year)!='number') 
  {
      checkString(year);
      year=year.trim()
      year=Number(year)
  }
  if(typeof(hour)!='number') 
  {
      checkString(hour);
      hour=hour.trim()
      hour=Number(hour)
  }
  if(~~month!=month) throw 'parameter month is wrong';
  if(~~day!=day) throw 'parameter day is wrong';
  if(~~year!=year) throw 'parameter year is wrong';
  if(~~hour!=hour) throw 'parameter year is wrong';
  let mm={};
  for(let i=1;i<=12;i++)
  {
    if ([1,3,5,7,8,10,12].includes(i)) mm[i]=31;
    if([4,6,9,11].includes(i)) mm[i]=30;
    if(i===2) mm[i]=28
  }
  if(month>0&&month<13)
  {
    if(day<0||day>mm[month]) throw `there are not ${day} days in this month `
  }
  else throw`parameter month is wrong`
  let myday = new Date()
  if(year>myday.getFullYear()) time=true
  else if(year<myday.getFullYear()) time=false
  else if(month>myday.getMonth()+1) time=true
  else if(month<myday.getMonth()+1) time=false
  else if(day>myday.getDate()) time=true
  else if(day<myday.getDate()) time=false
  else if(hour>myday.getHours()) time=true
  else if(hour<=myday.getHours()) time=false
  if(!time) throw'the time is false'
}

module.exports = {
  async createAppointment(userId, parkId, activityId, year, month, day, hour) {
    if (!userId || !parkId || !activityId || !year || !month || !day || !hour) throw 'please provide all inputs for appointment';
    if (!ObjectId.isValid(userId)) throw 'invalid user ID';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    if (!ObjectId.isValid(activityId)) throw 'invalid park ID';
    checktime(month,day,year,hour)
    let park=await getParkById(parkId)
    if(Number(hour)<Number(park.openTime.slice(0,2))||Number(hour)>=Number(park.closeTime.slice(0,2))) throw 'the time is wrong'

    const appointmentCollection = await appointments();
    const userCollection=await users();
    let appointmentId;
    const activity=await activitydata.get(activityId) 
  
    let appointment = await appointmentCollection.find({parkId:ObjectId(parkId),activityId:ObjectId(activityId),year:year,day:day,hour:hour}).toArray();
    if(appointment.length!=0){
      if(appointment.find(x=>x.user.includes(ObjectId(userId)))) {throw "you can't submit the same appointment"}
      else {
        let matchedappointment=appointment.find(element=>element.user.length<Number(activity.limit))
        if(matchedappointment) {
        matchedappointment.user.push(ObjectId(userId))
        if(matchedappointment.user.length==Number(activity.limit)) matchedappointment.status=true
        let updateInfo = await appointmentCollection.updateOne(
          { _id: ObjectId(matchedappointment._id) },
          { $set: matchedappointment }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
          throw 'Update failed';
        
        let user=await getUserById(userId)
        user.appointments.push(matchedappointment._id)
        updateInfo=await userCollection.updateOne(
          { _id: ObjectId(userId) },
          { $set: {appointments:user.appointments} }
        )
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
          throw 'Update user failed';
        appointmentId=matchedappointment._id.toString()
      }else{
        if(appointment.length==Number(activity.maxPeople)/Number(activity.limit)) throw"The number of activity's appointment is max, you can't make an appointment"
        let status=false;
        if(Number(activity.limit)==1) status=true
        let newAppointment = {
          parkId:ObjectId(parkId),
          activityId:ObjectId(activityId),
          user:[ObjectId(userId)],
          year:year,
          month:month,
          day:day,
          hour:hour,
          status:status
        };
        const insertInfo = await appointmentCollection.insertOne(newAppointment);
        if (insertInfo.insertedCount === 0) throw 'Could not add appointment';
        const newId = insertInfo.insertedId;
        let user=await getUserById(userId)
        user.appointments.push(newId)
        updateInfo=await userCollection.updateOne(
          { _id: ObjectId(userId) },
          { $set: {appointments:user.appointments} }
        )
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
          throw 'Update user failed';
        appointmentId = newId.toString();
      }
    }
  }else{
    let status=false;
    if(Number(activity.limit==1)) status=true
    let newAppointment = {
      parkId:ObjectId(parkId),
      activityId:ObjectId(activityId),
      user:[ObjectId(userId)],
      year:year,
      month:month,
      day:day,
      hour:hour,
      status:status
    };
    const insertInfo = await appointmentCollection.insertOne(newAppointment);
    if (insertInfo.insertedCount === 0) throw 'Could not add appointment';
    const newId = insertInfo.insertedId;
    let user=await getUserById(userId)
    user.appointments.push(newId)
    updateInfo=await userCollection.updateOne(
      { _id: ObjectId(userId) },
      { $set: {appointments:user.appointments} }
    )
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update user failed';
    appointmentId = newId.toString();
    }
    appointment=await this.getAppointmentById(appointmentId)
    return appointment
  },
  
  async getAppointmentByemail(email){
    const appointmentCollection=await appointments();
    let user=await getUserByEmail(email)
    const appointmentlist=[];
    let appointment;
    for(let id of user.appointments){
      appointment=await appointmentCollection.findOne({_id:id})
      appointmentlist.push(appointment)
    }
    return appointmentlist
  },

  async getAppointmentById(appointmentId){
    const appointmentCollection=await appointments();
    let appointment=await appointmentCollection.findOne({_id:ObjectId(appointmentId)})
    return appointment
  },

  async cancelAppointmentById(appointmentId) {
    if (typeof appointmentId === 'undefined') throw "appointmentId is undefined!";
    if (!ObjectId.isValid(appointmentId) && typeof appointmentId !== 'string') throw "appointmentId is not a string or objectKey!"
    if (!ObjectId.isValid(appointmentId)) {
      throw "appointmentId doesn't exist!";
    } 
    const appointmentCollection=await appointments();
    const userCollection = await users();
    let appointment=await this.getAppointmentById(appointmentId)
    let user,index;
    for(let userId of appointment.user){
      user= await getUserById(userId.toString())
      for(let i=0;i<user.appointments.length;i++)
      {
        if(user.appointments[i].toString()==appointmentId) 
        {
          index=i;
          break;
        }
      }
      user.appointments.splice(index,1)
      await userCollection.updateOne(
        { _id: userId },
        { $set: { appointments: user.appointments } }
      );
    }
    const deletionInfo = await appointmentCollection.deleteOne({ _id: ObjectId(appointmentId) });
    if (deletionInfo.deletedCount === 0) {
    throw `Could not cancel appointment with id of ${id}`;
  }
    

  },

}
