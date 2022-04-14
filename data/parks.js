const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;

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
  }
}