// Activities is a sub-document of park
const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const { ObjectId } = require('mongodb');

function checkActivityId(activityId) {
  if (arguments.length !== 1) throw 'paramater is wrong';
  if (!activityId) throw 'paramater is not exist';
  if (typeof activityId !== 'string' || activityId.trim().length === 0) throw 'paramater must be a string and it could not be empty';
  if (!ObjectId.isValid(activityId)) throw 'Invalid Object activityId';
}

module.exports = {
  async createActivity(parkId, name, numberOfCourts, maxPeople, appointmens, comments, reviews) {
    if (!parkId || !name || !numberOfCourts || !maxPeople || !appointmens || !comments || !reviews)
      throw 'please provide all inputs';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';

    const newId = ObjectId();
    let newActivity = {
      _id: newId,
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
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not add an activity';
    return true;
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
    try {
      checkActivityId(activityId);
    } catch (error) {
      throw error;
    }

    const parkCollection = await parks();
    const activity = await parkCollection.findOne({
      activities: {
        $elemMatch: { _id: ObjectId(activityId) }
      }
    }, {
      projection: {
        "activities.$": 1
      }
    });
    if (!park || park.activities.length == 0) throw 'No activity exist';
    return activity;

  },
  async getAllActivity(parkId) {
    if (arguments.length !== 1) throw 'paramater is wrong';
    if (!parkId) throw 'paramater is not exist';
    if (typeof parkId !== 'string' || parkId.trim().length === 0) throw 'paramater must be a string and it could not be empty';
    if (!ObjectId.isValid(parkId)) throw 'Invalid Object parkId';
    const parkCollection = await parks();
    const park = await parkCollection.find({
      _id: ObjectId(parkId)
    }, {
      projection: {
        activities: 1
      }
    });
    if (!park) throw 'Could not find activity';
    return park.activities;

  }
}