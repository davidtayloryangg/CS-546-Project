// Comments is a sub-document of park ?????
// ?????????????????????
const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;

module.exports = {
  async createComment(parkId, rating, parkReviews) {
    if (!userId || !rating || !parkReviews)
      throw 'please provide all inputs';
    if (!ObjectId.isValid(parkId)) throw 'invalid user ID';

    const newId = ObjectId();
    let newComment = {
      _id: newId,
      parkId: parkId,
      rating: rating,
      parkReviews: parkReviews
    };
    
    const parkCollection = await parks();
    const updateInfo = await parkCollection.updateOne({ _id: ObjectId(parkId) },
      { $addToSet: { comments: newComment } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not add a comment';
    return true;
  }
}