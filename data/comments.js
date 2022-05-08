// Comments is a sub-document of park
const func = require('./functions');
const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const userdata = require("./users");
const { ObjectId } = require('mongodb');

module.exports = {
  async createComment(parkId, userId, rating, parkComment) {
    if (!parkId || !userId || !rating || !parkComment) throw 'please provide all inputs for comment';
    if (arguments.length != 4) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    if (!ObjectId.isValid(userId)) throw 'invalid user ID';

    const newId = ObjectId();
    const date = new Date();
    let newComment = {
      _id: newId,
      parkId: parkId,
      userId: userId,
      rating: rating,
      timestamp: date.toDateString(),
      parkComment: parkComment,
      reply: []
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
      { _id: ObjectId(parkId) },
      { $set: { averageRating: rate } }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw 'Could not update average rating';
    return newComment;
  },
  async removeComment(commentId) {
    if (!commentId) throw 'please provide comment id';
    if (arguments.length != 1) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(commentId)) throw 'invalid comment ID';

    const parkCollection = await parks();
    let park = await parkCollection.findOne({ "comments._id": ObjectId(commentId) });
    if (park === null) throw 'No comment with that id';
    const updateInfo = await parkCollection.updateOne(
      { _id: ObjectId(park._id) },
      { $pull: { comments: { _id: ObjectId(commentId) } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not remove that a comment';

    park = await parkCollection.findOne({ _id: ObjectId(park._id) });
    const rating = func.computeRating(park);
    const updatedInfo = await parkCollection.updateOne(
      { _id: ObjectId(park._id) },
      { $set: { averageRating: rating } }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw 'Could not update average rating';
    return true;
  },
  async getAllComments(parkId) {
    if (!parkId) throw 'please provide park id';
    if (arguments.length != 1) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';

    const parkCollection = await parks();
    const parkList = await parkCollection.find({ _id: ObjectId(parkId) }, { projection: { comments: 1 } }).toArray();
    if (!parkList || parkList === null) throw 'no park with that id';
    return parkList;
  },

  async replyComment(commentId, userId, newUserComment) {
    if (!commentId || !userId || !newUserComment) throw 'please provide comment id and comment';
    if (arguments.length != 3) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(commentId)) throw 'invalid comment ID';
    if (!ObjectId.isValid(userId)) throw 'invalid comment ID';

    const user = await userdata.getUserById(userId);
    const name = user.firstname + " " + user.lastname;
    const id = user._id;
    const date = new Date();
    const newId = ObjectId();
    let newcomment = {
      _id: newId,
      userId: id,
      username: name,
      usercomment: newUserComment,
      timestamp: date.toDateString(),
    };

    const parkCollection = await parks();
    let park = await parkCollection.findOne({ "comments._id": ObjectId(commentId) });
    if (park === null)
      park = await parkCollection.findOne({ "comments.reply._id": ObjectId(commentId) });
    if (park === null) throw 'No comment with that id';
    const updateInfo = await parkCollection.updateOne(
      { "comments._id": ObjectId(commentId) },
      { $addToSet: { "comments.$.reply": newcomment } }
    );
    const updateInfo2 = await parkCollection.updateOne(
      { "comments.reply._id": ObjectId(commentId) },
      { $addToSet: { "comments.$.reply": newcomment } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount && !updateInfo2.matchedCount && !updateInfo2.modifiedCount)
      throw 'Could not reply that a comment';
    return true;
  },

  async getUserByCommentId(commentId) {
    if (!commentId) throw 'please provide comment id';
    if (arguments.length != 1) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(commentId)) throw 'invalid comment ID';

    const parkCollection = await parks();
    let park = await parkCollection.findOne(
      { "comments._id": ObjectId(commentId) },
      { projection: { comments: 1 } }
    );
    if (park === null) {
      park = await parkCollection.findOne(
        { "comments.reply._id": ObjectId(commentId) },
        { projection: { comments: 1 } }
      );
    }
    if (park === null) throw 'No comment with that id';
    var userId = null;
    for (const element of park.comments) {
      if (element._id.toString() === commentId.toString()) {
        userId = element.userId;
        break;
      }
      for (const e of element.reply) {
        if (e._id.toString() === commentId.toString()) {
          userId = e.userId;
          break;
        }
      }
    }
    if (userId === null) throw "could not find that user with that comment";
    const user = await userdata.getUserById(userId);
    return user;
  }
}