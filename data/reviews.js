// Reviews is a sub-document
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

module.exports = {
  async createReview(userId, userReviews) {
    if (!userId || !userReviews)
      throw 'please provide all inputs';
    if (!ObjectId.isValid(userId)) throw 'invalid user ID';

    const newId = ObjectId();
    let newReview = {
      _id: newId,
      userId: userId,
      userReviews: userReviews
    };
    
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne({ _id: ObjectId(userId) },
      { $addToSet: { reviews: newReview } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not add a review';
    return true;
  }
}