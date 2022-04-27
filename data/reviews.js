// Reviews is a sub-document of users
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const parks = mongoCollections.parks;
const { ObjectId } = require('mongodb');

module.exports = {
  async createReview(userId, activityId, userReview) {
    if (!userId || !userReview) throw 'please provide all inputs';
    if (!ObjectId.isValid(userId)) throw 'invalid user ID';

    const newId = ObjectId();
    let newReview = {
      reviewId: newId,
      userId: userId,
      userReview: userReview,
      reviewReply: []
    };
    
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne({ _id: ObjectId(userId) },
      { $addToSet: { reviews: newReview } }
    );

    const parkCollection = await parks();
    const updateInfo2 = await parkCollection.update({ "activities._id": ObjectId(activityId) },
      { "$push": { "activities.$.reviews": newReview}}
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not add a review to user';
    if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
      throw 'Could not add a review to activity';
    return true;
  },
  async removeReview(reviewId) {
    if (!reviewId) throw 'please provide review id';
    if (!ObjectId.isValid(reviewId)) throw 'invalid review ID';

    const userCollection = await users();
    let user = await userCollection.findOne({ "reviews.reviewId": ObjectId(reviewId) });
    if (user === null) throw 'No review with that id';
    const updateInfo = await userCollection.updateOne(
      { _id: ObjectId(user._id)},
      { $pull: { reviews: { reviewId: ObjectId(reviewId) } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not remove that a review';
    return true;
  },
  async getAllReviews(userId) {
    if (!userId) throw 'please provide user id';
    if (!ObjectId.isValid(userId)) throw 'invalid user ID';
    
    const userCollection = await parks();
    const userList = await userCollection.find({ _id: ObjectId(userId) }, { projection: { reviews: 1 } }).toArray();
    if (!userList || userList === null) throw 'no user with that id';
    return userList;
  },
  async replyReview(reviewId, userReview) {
    if (!reviewId || !userReview) throw 'please provide review id and review';
    if (!ObjectId.isValid(reviewId)) throw 'invalid review ID';

    const newId = ObjectId();
    let newReview = {
      reviewId: newId,
      userId: userId,
      userReview: userReview,
    };

    const userCollection = await users();
    let user = await userCollection.findOne({ "reviews._id": ObjectId(reviewId) });
    if (user === null) throw 'No review with that id';
    const updateInfo = await userCollection.updateOne(
      { _id: ObjectId(user._id)},
      { $addToSet: { reviews: { reviewReply : newReview} } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not reply that a review';
    return true;
  }
}