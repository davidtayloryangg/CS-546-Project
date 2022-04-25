(function ($) {
  $(document).ready(function () {
    $.ajax({
      url: "http://localhost:3000/parks/AllParks",
      type: "get",
      dataType: "json",
      success: function (res) {
        var list = $("#ParkRecommentdationList");
        console.log(res);
        for (const element of res) {
          var li = document.createElement("li");
          li.innerHTML = `
          <div class="searchDivStyle">
            <a href="../" class="a">
              <div class="searchDivStyleLeft">
                <img src="/public/img/default_img.gif" onerror="this.src='https://blog.nscsports.org/wp-content/uploads/2014/10/default-img.gif'">
              </div>
              <div class="searchDivStyleRight">
                <p>${element.name}</p>
                <p>Open Time: ${element.openTime}</p>
                <p>Close Time: ${element.closeTime}</p>
                <p>Address: ${element.location}</p>
                <br/>
              </div>
            </a>
          </div>
          `;
          list.append(li);
        }
      }
    })
  })


})(jQuery);