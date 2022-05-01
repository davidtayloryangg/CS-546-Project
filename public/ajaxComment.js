(function ($) {
  $(document).ready(function () {
    var parkId = $("#singleParkId").text();
    var commentsList = $("#commentsList");

    $.ajax({
      url: "http://localhost:3000/parks/id/comments/" + parkId,
      type: "get",
      dataType: "json",
      data: $('#singleParkId').serialize(),
      success: function (userList) {
        commentsList.empty();
        for (const element of userList) {
          var li = document.createElement("li");
          li.innerHTML = `
            <div class="comment">
                <div class="commentUser">
                    <div class="user">
                      <p>${element.username}</p>
                    </div>
                </div>
                <div class="commentContent">
                    <div>${element.comment}</div>
                    <button class="replyButton" id="replyButton"> Reply </button>
                </div>
            </div>
          `;
          commentsList.append(li);
        }
      }
    })
  });
})(jQuery);

$("#commentButton").click({

});

$("#replyButton").click({

});