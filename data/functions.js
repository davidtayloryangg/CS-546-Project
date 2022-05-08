// This file provides validator functions
const { ObjectId } = require('mongodb');

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
  var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
  if (string.trim() === "") {
    throw "Error: Email must be not empty";
  } else if (!reg.test(string.trim())) {
    throw "Error: invalid email format"
  } else {
    return true;
  }
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
  return Math.floor((rating / num) * 100) / 100;
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
function checkNumber(val) {
  if (typeof val !== "number")
    return false;
  if (isNaN(val))
    return false;
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
  checkString,
  checkNumber
}