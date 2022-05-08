const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const parks = mongoCollections.parks;
const func = require('./functions');

module.exports = {
  async createUser(firstname, lastname, email, password) {
    if (!firstname || !lastname || !email || !password)
      throw 'Please provide firstname, lastname, email address and password';
    func.checkUserName(firstname);
    func.checkUserName(lastname);
    func.checkEmail(email);
    func.checkPassword(password);

    const userCollection = await users();
    const user = await userCollection.findOne({ email: email.toLowerCase() });
    if (user !== null) throw 'this email has been registered!';

    const saltRounds = 16;
    const hash = await bcrypt.hash(password, saltRounds);
    const newId = ObjectId();
    let newUser = {
      _id: newId,
      firstname: firstname,
      lastname: lastname,
      email: email.toLowerCase(),
      gender: '',
      city: '',
      state: '',
      age: 0,
      description: '',
      hashedPassword: hash,
      permission: "basic",
      reviews: [],
      appointments: [],
      favorites: []
    };
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';
    newUser = await userCollection.findOne(newUser);
    return newUser;
  },

  async checkUser(email, password) {
    if (!email || !password) throw 'Please provide email address and password';
    func.checkEmail(email);
    func.checkPassword(password);
    const userCollection = await users();
    const user = await userCollection.findOne({ email: email.toLowerCase() });
    if (user === null) throw 'Either the email address or password is invalid';
    let comparePassword = bcrypt.compare(password, user.hashedPassword);
    if (comparePassword) return user;
    else throw 'Either the username or password is invalid';
  },

  async modifyUserProfile(id, email, gender, city, state, age, description) {
    if (!id || !email || !gender || !city || !state || !age || !description)
      throw "must provide all parameters for modify user profile";
    if (!ObjectId.isValid(id)) throw 'invalid user ID';
    if (arguments.length != 7) throw 'the number of parameter is false';
    if (!id) throw 'You must provide an id to search for';
    func.checkId(id)
    func.checkEmail(email)
    func.checkString(gender)
    func.checkString(city)
    func.checkString(state)
    func.checkNumber(age)
    if (age < 0) throw "age must be positive"
    func.checkString(description)

    const userCollection = await users();
    let modifyuser = {
      email: email,
      gender: gender,
      city: city,
      state: state,
      age: age,
      description: description
    };

    const updatedInfo = await userCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: modifyuser }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
      throw 'could not update user successfully';
    }
    return true;
  },

  async getUserById(id) {
    func.checkId(id)
    const userCollection = await users()
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (user === null) throw 'No user with that id';
    user._id = user._id.toString();
    return user;
  },

  async getUserByEmail(email) {
    const userCollection = await users()
    const user = await userCollection.findOne({ email: email });
    if (user === null) throw 'No user with that email';
    user._id = user._id.toString();
    return user;
  },

  async addfavorite(userId, parkId) {
    const userCollection = await users()
    const parkCollection = await parks()
    const user = await userCollection.findOne({ _id: ObjectId(userId) })
    const park = await parkCollection.findOne({ _id: ObjectId(parkId) })
    let newfavorite = { parkId: parkId, parkname: park.name }
    user.favorites.push(newfavorite)
    const updateInfo = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          favorites: user.favorites
        }
      }
    )
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
      throw 'could not update user successfully';
    }
    const user1 = await userCollection.findOne({ _id: ObjectId(userId) })
    return true;
  },
  async updateUserPermission(id) {
    if (!id) throw 'please provide user id to update permission';
    if (!ObjectId.isValid(id)) throw 'invalid user ID';

    let userUpdateInfo = {
      permission: "admin"
    };
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update user permission failed';
    return true;
  },

}
