(function ($) {
  $(document).ready(function () {
    $("#orderByRating").click();
  });
})(jQuery);

$("#orderByRating").click(function () {
  $("#homeSearchDiv").hide();
  $("#homelink").show();
  $("#homeRecommendationDiv").fadeIn(100);
  $("#homePopularDiv").fadeOut(100);
  $.ajax({
    url: "http://localhost:3000/parks/ParksOrderByRating",
    type: "get",
    dataType: "json",
    success: function (res) {
      var imgList = $("#homeRecommendationImgList");
      var txtList = $("#homeRecommendationTxtList");
      imgList.empty();
      txtList.empty();
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
  });
});

$("#orderByLikes").click(function () {
  $("#homeSearchDiv").hide();
  $("#homelink").show();
  $("#homeRecommendationDiv").fadeOut(100);
  $("#homePopularDiv").fadeIn(100);
  $.ajax({
    url: "http://localhost:3000/parks/ParksOrderByLikes",
    type: "get",
    dataType: "json",
    success: function (res) {
      var imgList = $("#homePopularImgList");
      var txtList = $("#homePopularTxtList");
      imgList.empty();
      txtList.empty();
      for (const element of res) {
        var imgLi = document.createElement("li");
        imgLi.innerHTML = `
            <div class="homePopularImgListItem">
              <img src=${element.imgUrl} onerror="this.src='https://blog.nscsports.org/wp-content/uploads/2014/10/default-img.gif'">
            </div>
          `;
        imgList.append(imgLi);
        var txtLi = document.createElement("li");
        var rating = (element.averageRating / 5) * 100;
        txtLi.innerHTML = `
            <div class="homePopularTxtListItem">
              <a href="/parks/${element._id}" class="a">
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
  });
});

$("#homeSearch").click(function () {
  var likesDiv = $("#homePopularDiv");
  var ratingDiv = $("#homeRecommendationDiv");
  var searchDiv = $("#homeSearchDiv");
  var homelink = $("#homelink");
  homelink.hide();
  likesDiv.hide();
  ratingDiv.hide();
  searchDiv.show();
  $.ajax({
    url: "http://localhost:3000/parks/search",
    type: "post",
    data: $('#searchForm').serialize(),
    dataType: "json",
    success: function (res) {
      var imgList = $("#homeSearchImgList");
      var txtList = $("#homeSearchTxtList");
      imgList.empty();
      txtList.empty();
      for (const element of res) {
        var imgLi = document.createElement("li");
        imgLi.innerHTML = `
            <div class="homeSearchImgListItem">
              <img src=${element.imgUrl} onerror="this.src='https://blog.nscsports.org/wp-content/uploads/2014/10/default-img.gif'">
            </div>
          `;
        imgList.append(imgLi);
        var txtLi = document.createElement("li");
        var rating = (element.averageRating / 5) * 100;
        txtLi.innerHTML = `
            <div class="homeSearchTxtListItem">
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
});

$("#parkComment").click(function () {
  var likesDiv = $("#homePopularDiv");
  var ratingDiv = $("#homeRecommendationDiv");
  var searchDiv = $("#homeSearchDiv");
  var homelink = $("#homelink");
  homelink.hide();
  likesDiv.hide();
  ratingDiv.hide();
  searchDiv.show();
  $.ajax({
    url: "http://localhost:3000/parks/search",
    type: "post",
    data: $('#searchForm').serialize(),
    dataType: "json",
    success: function (res) {
      var imgList = $("#homeSearchImgList");
      var txtList = $("#homeSearchTxtList");
      imgList.empty();
      txtList.empty();
      for (const element of res) {
        var imgLi = document.createElement("li");
        imgLi.innerHTML = `
            <div class="homeSearchImgListItem">
              <img src=${element.imgUrl} onerror="this.src='https://blog.nscsports.org/wp-content/uploads/2014/10/default-img.gif'">
            </div>
          `;
        imgList.append(imgLi);
        var txtLi = document.createElement("li");
        var rating = (element.averageRating / 5) * 100;
        txtLi.innerHTML = `
            <div class="homeSearchTxtListItem">
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

})