// Comments is a sub-document of park ?????
// ?????????????????????
const func = require('./functions');
const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;


module.exports = {
  async createComment(parkId, rating, parkReview) {
    if (!userId || !rating || !parkReview)
      throw 'please provide all inputs';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';

    const newId = ObjectId();
    let newComment = {
      _id: newId,
      parkId: parkId,
      rating: rating,
      parkReview: parkReview
    };
    
    const parkCollection = await parks();
    const updateInfo = await parkCollection.updateOne({ _id: ObjectId(parkId) },
      { $addToSet: { comments: newComment } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not add a comment';
    
    let park = await parkCollection.findOne({ _id: ObjectId(parkId) });
    const rate = func.computeRating(park);
    const updatedInfo = await parkCollection.updateOne(
      {_id: ObjectId(parkId)},
      {$set: { averageRating: rate}}
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw 'Could not update average rating';
    return true;
  },
  async removeComment(commentId) {
    if (!commentId) throw 'please provide comment id';
    if (!ObjectId.isValid(commentId)) throw 'invalid comment ID';

    const parkCollection = await parks();
    let park = await parkCollection.findOne({ "comments._id": ObjectId(commentId) });
    if (park === null) throw 'No comment with that id';
    const updateInfo = await parkCollection.updateOne(
      { _id: ObjectId(park._id)},
      { $pull: { comments: { _id: ObjectId(commentId) } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not remove that a comment';
    
    park = await parkCollection.findOne({ _id: ObjectId(park._id) });
    const rating = func.computeRating(park);
    const updatedInfo = await parkCollection.updateOne(
      {_id: ObjectId(park._id)},
      {$set: { averageRating: rating}}
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw 'Could not update average rating';
    return true;
  },
  async getAllComments(parkId) {
    if (!parkId) throw 'please provide park id';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    
    const parkCollection = await parks();
    const parkList = await parkCollection.find({ _id: ObjectId(parkId) }, { projection: { comments: 1 } }).toArray();
    if (!parkList || parkList === null) throw 'no park with that id';
    return parkList;
  }

}