(function ($) {
  $(document).ready(function () {
    $(".actSearchDiv").hide();
  });
})(jQuery);

$("#actSearch").click(function () {
  $(".ActList").hide();
  $(".actSearchDiv").show();
  $.ajax({
    url: "http://localhost:3000/parks/search",
    type: "post",
    data: $('#actSearchForm').serialize(),
    dataType: "json",
    success: function (res) {
      var txtList = $("#actSearchTxtList");
      txtList.empty();
      for (const element of res) {
        var imgLi = document.createElement("li");
        imgLi.innerHTML = `
            <div class="actSearchImgListItem">
              <img src=${element.imgUrl} onerror="this.src='https://blog.nscsports.org/wp-content/uploads/2014/10/default-img.gif'">
            </div>
          `;
        txtList.append(imgLi);
        var txtLi = document.createElement("li");
        var rating = (element.averageRating / 5) * 100;
        txtLi.innerHTML = `
            <div class="actSearchTxtListItem">
              <a href="/parks/id/${element._id}" class="a">
                  <p>${element.name}</p>
                  <div class="star-rating-num">(${element.averageRating})
                      <div class="star-rating">
                          <div class="star-rating-top" style="width:${rating}%">
                              <span>★</span>
                              <span>★</span>
                              <span>★</span>
                              <span>★</span>
                              <span>★</span>
                          </div>
                          <div class="star-rating-bottom">
                              <span>★</span>
                              <span>★</span>
                              <span>★</span>
                              <span>★</span>
                              <span>★</span>
                          </div>
                      </div>
                  </div>
                  <p>Open Time: ${element.openTime}</p>
                  <p>Close Time: ${element.closeTime}</p>
                  <p>Address: ${element.location}</p>
                  <br/>
              </a>
            </div>
          `;
        txtList.append(txtLi);
      }
    },
    error: function (error) {
      alert("search failed");
    }
  });
  return false;
})