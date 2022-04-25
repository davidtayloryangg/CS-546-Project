const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const { ObjectId } = require('mongodb');

module.exports = {
  async createPark(name, opentime, closetime, location) {
    if (!name || !opentime || !closetime || !location)
      throw 'please provide all inputs';

    const parkCollection = await parks();
    const park = await parkCollection.findOne({ name: name.toLowerCase() });
    if (park !== null) throw 'this park has been registered!';

    const newId = ObjectId();
    // const newOpentime = new Date();
    // const newClosetime = new Date();
    let newPark = {
      _id: newId,
      name: name,
      openTime: opentime,
      closeTime: closetime,
      location: location,
      activities: [],
      comments: [],
      averageRating: 0,
      imgUrl: "/public/img/default_img.gif"
    };
    const insertInfo = await parkCollection.insertOne(newPark);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add a park';
    newPark = await parkCollection.findOne(newPark);
    return newPark;
  },
  async removePark(id) {
    if (!id) throw 'please provide park ID';
    if (!ObjectId.isValid(id)) throw 'invalid park ID';

    const parkCollection = await parks();
    const deletionInfo = await parkCollection.deleteOne({ _id: ObjectId(id) });
    if (deletionInfo.deletedCount === 0) throw `Could not delete park with id of ${id} `;
    return true;
  },
  async updatePark(id, name, opentime, closetime, location) {
    if (!id || !name || !opentime || !closetime || !location) throw 'please provide all inputs';
    if (!ObjectId.isValid(id)) throw 'invalid park ID';

    // const newOpentime = new Date(opentime);
    // const newClosetime = new Date(closetime);
    let parkUpdateInfo = {
      name: name,
      openTime: opentime,
      closeTime: closetime,
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
  async updateParkImg(id, url) {
    if (!id || !url) throw 'please provide all inputs';
    if (!ObjectId.isValid(id)) throw 'invalid park ID';

    let parkUpdateInfo = {
      imgUrl: url
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
    const parkList = await parkCollection.find({}, {
      // projection: { _id: 1, name: 1 }
    }).toArray();
    if (!parkList) throw 'could not get all parks';
    return parkList;
  },
  async getParkById(id) {
    if (!id) throw 'please provide park ID';
    if (!ObjectId.isValid(id)) throw 'invalid park ID';

    const parkCollection = await parks();
    const park = await parkCollection.findOne({ _id: ObjectId(id) });
    if (park === null) throw 'could not get that parks';
    return park;
  },
  async getParkByName(name) {
    if (!name) throw 'please provide park name';

    const parkCollection = await parks();
    const park = await parkCollection.findOne({ name: name });
    if (park === null) throw 'could not get that parks';
    return park;
  }
}