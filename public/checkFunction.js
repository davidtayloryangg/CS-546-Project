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
    return true;
  }
}