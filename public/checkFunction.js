function checkEmail() {
  var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
  var obj = document.getElementById("email");
  if (obj.value === "") {
    $("#inputError").text("Error: Email must be not empty");
    return false;
  } else if (!reg.test(obj.value)) {
    $("#inputError").text("Error: invalid email format")
    return false;
  } else {
    $("#inputError").text('');
    return true;
  }
}

function checkPassword() {
  var obj = document.getElementById("password");
  if (obj.value.trim() === "") {
    $("#inputError").text("Error: password must be not empty");
    return false;
  } else if (obj.value.trim().length < 8) {
    $("#inputError").text('password should be at least 8 chars long');
    return false;
  } else {
    $("#inputError").text('');
    return true;
  }
}

function checkLastname() {
  var obj = document.getElementById("lastname");
  if (obj.value.trim() === "") {
    $("#inputError").text("Error: lastname must be not empty");
    return false;
  } else if (obj.value.trim().length < 3) {
    $("#inputError").text('lastname should be at least 3 chars long');
    return false;
  } else {
    $("#inputError").text('');
    return true;
  }
}

function checkFirstname() {
  var obj = document.getElementById("firstname");
  if (obj.value.trim() === "") {
    $("#inputError").text("Error: firstname must be not empty");
    return false;
  } else if (obj.value.trim().length < 3) {
    $("#inputError").text('firstname should be at least 3 chars long');
    return false;
  } else {
    $("#inputError").text('');
    return true;
  }
}

function checkNumber() {
  var obj = document.getElementById("userage");
  if (obj.value.trim() === "") {
    $("#inputError").text("Error: user age must be not empty");
    return false;
  } else if (isNaN(obj.value.trim())) {
    $("#inputError").text('user age is not a number');
    return false;
  } else if (obj.value.trim() < 0) {
    $("#inputError").text('user age must be positive');
    return false;
  } else {
    $("#inputError").text('');
    return true;
  }
}

$("body").on("change", "#userModify", function checkUserInfo(event) {
  var objValue = event.target.value;
  var objName = event.target.name;
  if (objValue.trim() === "") {
    $("#inputError").text(`Error: ${objName} must be not empty`);
    return false;
  } else {
    $("#inputError").text('');
    return true;
  }
})
