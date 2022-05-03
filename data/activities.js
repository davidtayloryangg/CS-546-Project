// Activities is a sub-document of park
const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const { ObjectId } = require('mongodb');
const func = require('./functions');

function checkActivityId(activityId) {
  if (arguments.length !== 1) throw 'paramater is wrong';
  if (!activityId) throw 'paramater is not exist';
  if (typeof activityId !== 'string' || activityId.trim().length === 0) throw 'paramater must be a string and it could not be empty';
  if (!ObjectId.isValid(activityId)) throw 'Invalid Object activityId';
}

module.exports = {
  async createActivity(parkId, name, numberOfCourts, maxPeople) {
    if (!parkId || !name || !numberOfCourts || !maxPeople) throw 'please provide all inputs for act';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    func.checkNumber(numberOfCourts);
    func.checkNumber(maxPeople);

    const newId = ObjectId();
    let newActivity = {
      _id: newId,
      parkId: parkId,
      name: name,
      numberOfCourts: numberOfCourts,
      maxPeople: maxPeople,
      appointmens: [],
      reviews: []
    };

    const parkCollection = await parks();
    const updateInfo = await parkCollection.updateOne({ _id: ObjectId(parkId) },
      { $addToSet: { activities: newActivity } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Could not add an activity';
    return newActivity;
  },
  async removeActivity(activityId) {

    checkActivityId(activityId);

    const parkCollection = await parks();
    const deletionInfo = await parkCollection.updateOne({
      activities: {
        $elemMatch: {
          _id: ObjectId(activityId)
        }
      }
    }, {
      $pull: {
        activities: {
          _id: ObjectId(activityId)
        }
      }
    });

    if (deletionInfo.modifiedCount === 0) throw `Could not delete park with activityId of ${activityId}`;
    return `activityId: ${activityId}, deleted: true`;
  },
  async updateActivity(activityId, parkId, name, numberOfCourts, maxPeople, appointmens, comments, reviews) {
    // if (typeof activityId !== 'string') throw 'paramaters must be string';
    // if (activityId.trim().length === 0) throw 'paramater cannot be an empty string or string with just spaces';
    // if (!ObjectId.isValid(id)) throw 'Invalid Object ID';
    const parkCollection = await parks();
    const updateactivities = {
      parkId,
      name,
      numberOfCourts,
      maxPeople,
      appointmens,
      comments,
      reviews
    };

    const updateInfo = await parkCollection.updateOne(
      { _id: ObjectId(activityId) },
      { $set: updateactivities }
    );
    if (updateInfo.modifiedCount === 0) {
      throw 'could not update activity successfully';
    }
    return await this.get(activityId);

  },
  async get(activityId) {
    checkActivityId(activityId);

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
    const parkCollection = await parks();
    var reg = new RegExp(activityName, "i");
    const parkList = await parkCollection.find({ "activities.name": { $regex: reg } }).toArray();
    if (!parkList) throw 'could not get park list';
    return parkList;
    // console.log(parkList);
  }


}