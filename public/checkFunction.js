
function checkEmail(event) {
  var id = event.target.id;
  var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/; //正则表达式
  var obj = document.getElementById(id); //要验证的对象
  if (obj.value === "") { //输入不能为空
    alert("input could not be empty!");
    return false;
  } else if (!reg.test(obj.value)) { //正则验证不通过，格式不对
    alert("pass");
    return false;
  } else {
    alert("not pass");
    return true;
  }
}
