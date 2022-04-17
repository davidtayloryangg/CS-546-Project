const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const { ObjectId } = require('mongodb');

module.exports = {
  async createPark(name, opentime, closetime, location) {
    if (!name || !opentime || !closetime || !location)
      throw 'please provide all inputs';
    
    const parkCollection = await parks();
    const park = await parkCollection.findOne({ name: name.toLowerCase()});
    if (park !== null) throw 'this park has been registered!';

    const newId = ObjectId();
    const newOpentime = new Date(opentime);
    const newClosetime = new Date(closetime);
    let newPark = {
      _id: newId,
      name: name,
      openTime: newOpentime,
      closeTime: newClosetime,
      location: location,
      activities: [],
      comments: [],
      averageRating: 0
    };
    const insertInfo = await parkCollection.insertOne(newPark);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add a park';
    return true;
  },
  async removePark(id) {
    if (!id) throw 'please provide park ID';
    if (!ObjectId.isValid(id)) throw 'invalid park ID';

    const parkCollection = await parks();
    const deletionInfo = await parkCollection.deleteOne({_id: ObjectId(id)});
    if (deletionInfo.deletedCount === 0) throw `Could not delete park with id of ${id}`;
    return true;
  },
  async updatePark(id, name, opentime, closetime, location) {
    if (!id || !name || !opentime || !closetime || !location) throw 'please provide all inputs';
    if (!ObjectId.isValid(id)) throw 'invalid park ID';

    const newOpentime = new Date(opentime);
    const newClosetime = new Date(closetime);
    let parkUpdateInfo = {
      name: name,
      openTime: newOpentime,
      closeTime: newClosetime,
      location: location,
    };
    const parkCollection = await parks();
    const updateInfo = await parkCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: parkUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update park failed';
    return true;
  },
  async getAllParks() {
    const parkCollection = await parks();
    const parkList = await parkCollection.find({}, { projection: { _id: 1, name: 1 } }).toArray();
    if (!parkList) throw 'could not get all parks';
    return parkList;
  },
  async getPark(id) {
    if (!id) throw 'please provide park ID';
    if (!ObjectId.isValid(id)) throw 'invalid park ID';

    const parkCollection = await parks();
    const park = await parkCollection.findOne({_id: ObjectId(id)});
    if (park === null) throw 'could not get that parks';
    return park;
  }
}