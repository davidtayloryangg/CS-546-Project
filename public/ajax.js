(function ($) {
  $(document).ready(function () {
    $.ajax({
      url: "http://localhost:3000/parks/AllParks",
      type: "get",
      dataType: "json",
      success: function (res) {
        var list = $("#ParkRecommentdationList");
        console.log(res);
        console.log("ddasdsadasdasdawdawdawd");
        for (const element of res) {
          var li = document.createElement("li");
          li.innerHTML = `
            <a href=""><h1>Recommentdation</h1></a>
            <br />
            <p>${element.name}</p>
            <b>Open Time</b>
            <p>${element.openTime}</p>
            <b>Close Time</b>
            <p>${element.closeTime}</p>
          `;
          list.append(li);
        }
      }
    })
  })


})(jQuery);