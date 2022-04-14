// This file provides validator functions

function checkUserName(string) {
  if (typeof string === 'string' || string instanceof String) {
    if (string.indexOf(" ") !== -1)
      throw 'name should not have space';
    if (string.trim().length < 3)
      throw 'name should be at least 3 chars long';
  } else {
    throw "not a string";
  }
}
function checkEmail(string) {
  if (!string.includes('.'))
    throw 'email should have a dot';
  if (!string.lastIndexOf('.') > (email.length - 3))
    throw 'should have at least 2 letters after dot';
  if (!string.indexOf('.') === 0 || email.indexOf('@') === 0)
    throw 'email should start with letter';
  if (string.indexOf('@') === -1)
    throw 'email should have @';
}
function checkPassword(string) {
  if (typeof string === 'string' || string instanceof String) {
    if (string.indexOf(" ") !== -1)
      throw 'password should not have space';
    if (string.trim().length < 8)
      throw 'password should be at least 8 chars long';
  } else {
    throw "not a string";
  }
}
function computeRating(park) {
  let rating = 0;
  let num = park.comments.length;
  if (num === 0) {
    return rating;
  }
  for (let a of park.comments) {
    rating += a.rating;
  }
  return rating / num;
}
function checkId(string) {
  return ObjectId.isValid(string);
}
function checkRating(val) {
  if (typeof val !== "number")
    return false;
  if (isNaN(val))
    return false;
  return !(val < 0 || val > 5);
}
function checkString(string) {
  if (!string)
    return false;
  if (typeof string === 'string' || string instanceof String) {
    if (string.trim().length === 0)
      return false;
  } else {
    return false;
  }
  return true;
}
module.exports = {
  checkUserName,
  checkEmail,
  checkPassword,
  computeRating,
  checkId,
  checkRating,
  checkString
}