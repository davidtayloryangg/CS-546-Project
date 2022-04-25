(function ($) {
  $(document).ready(function () {
    $.ajax({
      url: "http://localhost:3000/parks/AllParks",
      type: "get",
      dataType: "json",
      success: function (res) {
        var imgList = $("#homeRecommendationImgList");
        var txtList = $("#homeRecommendationTxtList");
        console.log(res);
        for (const element of res) {
          var imgLi = document.createElement("li");
          imgLi.innerHTML = `
            <div class="homeRecommendationImgListItem">
              <img src=${element.imgUrl} onerror="this.src='https://blog.nscsports.org/wp-content/uploads/2014/10/default-img.gif'">
            </div>
          `;
          imgList.append(imgLi);
          var txtLi = document.createElement("li");
          var rating = (element.averageRating / 5) * 100;
          txtLi.innerHTML = `
            <div class="homeRecommendationTxtListItem">
              <a href="/" class="a">
                  <p>${element.name}</p>
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
                  <p>Open Time: ${element.openTime}</p>
                  <p>Close Time: ${element.closeTime}</p>
                  <p>Address: ${element.location}</p>
                  <br/>
              </a>
            </div>
          `;
          txtList.append(txtLi);
        }
      }
    })
  })


})(jQuery);