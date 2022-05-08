// Activities is a sub-document of park
const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const { ObjectId } = require('mongodb');
const { getParkById, getAllParks } = require('./parks')
const func = require('./functions');

function checkActivityId(activityId) {
  if (arguments.length !== 1) throw 'paramater is wrong';
  if (!activityId) throw 'paramater is not exist';
  if (typeof activityId !== 'string' || activityId.trim().length === 0) throw 'paramater must be a string and it could not be empty';
  if (!ObjectId.isValid(activityId)) throw 'Invalid Object activityId';
}

module.exports = {
  async createActivity(parkId, name, numberOfCourts, maxPeople, limit) {
    if (!parkId || !name || !numberOfCourts || !maxPeople || !limit) throw 'please provide all inputs for act';
    if (arguments.length != 5) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    func.checkNumber(numberOfCourts);
    func.checkNumber(maxPeople);
    func.checkNumber(limit)

    // Checking the current activity was created or not:

    const checkActivityCollection = await parks();
    const checkavalibleActivity = await checkActivityCollection.findOne({ "activities.parkId": parkId, "activities.name": name });
    if (checkavalibleActivity != null) {
      throw 'This activity has been created before, you can cancel it and try to create it again!'
    }

    const newId = ObjectId();
    let newActivity = {
      _id: newId,
      parkId: parkId,
      name: name,
      numberOfCourts: numberOfCourts,
      maxPeople: maxPeople,
      limit: limit,
      description: "",
      appointments: [],
      reviews: []
    };
    const parkCollection = await parks();
    const updateInfo = await parkCollection.updateOne({ _id: ObjectId(parkId) },
      { $addToSet: { activities: newActivity } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Could not add an activity';
    return newActivity;
  },

  async deleteActivity(parkId, name) {
    if (!parkId || !name) throw 'please provide all inputs for act';
    if (arguments.length != 2) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    if (typeof name !== 'string' || name.trim().length === 0) throw 'name of activity must be a string and it could not be empty';

    // Checking the current activity was created or not:

    const checkActivityCollection = await parks();
    const checkavalibleActivity = await checkActivityCollection.findOne({ "_id": parkId, "activities.name": name });
    if (checkavalibleActivity == null) {
      throw 'This activity does not exist, you do not need to remove it!'
    }

    // Removing a particular activity for this park:

    const removeActivityCollection = await parks();
    removeActivityCollection.updateOne(
      { "_id": ObjectId(parkId) },
      { $pull: { activities: { name: name } } }
    );
  },
  async updateActivity(activityId, parkId, name, numberOfCourts, maxPeople, limit) {
    if (!activityId || !parkId || !name || !numberOfCourts || !maxPeople || !limit) throw 'please provide all inputs for act';
    if (arguments.length != 6) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(activityId)) throw 'Invalid Object ID';
    if (!ObjectId.isValid(parkId)) throw 'Invalid Object ID';
    const parkCollection = await parks();
    const updateactivities = {
      _id: ObjectId(activityId),
      parkId: parkId,
      name: name,
      numberOfCourts: numberOfCourts,
      maxPeople: maxPeople,
      limit: limit,
    };
    let park = await getParkById(parkId)
    let index = park.activities.findIndex(element => element._id.toString() == (activityId))
    park.activities.splice(index, 1, updateactivities)
    const updatepark = {
      name: park.name,
      openTime: park.openTime,
      closeTime: park.closeTime,
      location: park.location,
      activities: park.activities,
      comments: park.comments,
      averageRating: park.averageRating,
      likes: park.likes,
      imgUrl: park.imgUrl
    }
    const updatedInfo = await parkCollection.updateOne(
      { _id: ObjectId(parkId) },
      { $set: updatepark }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
      throw 'could not update park successfully';
    }
    return await this.get(activityId);

  },
  async get(activityId) {
    checkActivityId(activityId);
    if (arguments.length != 1) throw 'the number of parameter is wrong';
    const parkCollection = await parks();
    const park = await parkCollection.findOne({
      activities: {
        $elemMatch: { _id: ObjectId(activityId) }
      }
    }, {
      projection: {
        "activities.$": 1
      }
    });
    if (!park || park.activities.length == 0) throw 'No activity exist';
    let activity;
    for (let i of park.activities) {
      if (i._id.toString() === activityId) { activity = i; break; }
    }
    return activity;
  },
  async getAllActivity(parkId) {
    if (arguments.length !== 1) throw 'paramater is wrong';
    if (!parkId) throw 'paramater is not exist';
    if (!ObjectId.isValid(parkId)) throw 'Invalid Object parkId';
    const parkCollection = await parks();
    const park = await parkCollection.findOne(
      { _id: ObjectId(parkId) },
      { projection: { activities: 1 } }
    );
    if (!park) throw 'Could not find activity';
    return park.activities;

  },
  async getAllParksByActivityName(activityName) {
    if (!activityName) throw 'please provide activity name';
    if (arguments.length != 1) throw 'the number of parameter is wrong';

    const parkCollection = await parks();
    var reg = new RegExp(activityName, "i");
    const parkList = await parkCollection.find({ "activities.name": { $regex: reg } }).toArray();
    if (!parkList) throw 'could not get park list';
    return parkList;
    // console.log(parkList);
  },
  async getAllactivities() {
    if (arguments.length != 0) throw 'the number of parameter is wrong';

    const parklist = await getAllParks();
    let activitylist = []
    parklist.forEach(element => {
      for (let activity of element.activities) {
        if (!activitylist.includes(activity)) activitylist.push(activity)
      }
    });
    return activitylist
  },
  async updateActivityDescription(id, des) {
    if (!id || !des) throw 'please provide all inputs to update act des';
    if (arguments.length != 2) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(id)) throw 'invalid act ID';

    description = des.toString();
    const parkCollection = await parks();
    const updateInfo = await parkCollection.updateOne(
      { "activities._id": ObjectId(id) },
      { $set: { "activities.$.description": description } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update act des failed';
    return true;
  }

}