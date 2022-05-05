function checkEmail() {
  var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/; //正则表达式
  var obj = document.getElementById("email"); //要验证的对象
  if (obj.value === "") { //输入不能为空
    $("#inputError").text("Error: Email must be not empty");
    return false;
  } else if (!reg.test(obj.value)) { //正则验证不通过，格式不对
    $("#inputError").text("Error: invalid email format")
    return false;
  } else {
    return true;
  }
}