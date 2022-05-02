(function ($) {
  $(document).ready(function () {
    loadComments();
  });
})(jQuery);

$("#commentButton").click(function () {
  var parkId = $("#singleParkId").text();
  $.ajax({
    url: "http://localhost:3000/parks/id/comments/" + parkId,
    type: "post",
    dataType: "json",
    data: $("#newCommentForm").serialize(),
    success: function (commentInfo) {
      loadComments();
      $("#newCommentRating").val("");
      $("#newCommentTxt").val("");
    },
    error: function (error) {
      alert("you have to log in!")
    }
  })
});

$("#replyButton").click(function () {

});

function loadComments() {
  var parkId = $("#singleParkId").text();
  var commentsList = $("#commentsList");
  var username = $("#commentUsername");
  $.ajax({
    url: "http://localhost:3000/parks/id/comments/" + parkId,
    type: "get",
    dataType: "json",
    data: $('#singleParkId').serialize(),
    success: function (userList) {
      // Dynamic update username
      username.empty();
      var name = $("<p></p>").text(userList[0].currentUsername);
      username.append(name);
      //
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
                    <p class="replyButton" id="replyButton"> ${element.timestamp} &emsp;&emsp;Reply </p>
                    <p id="replyTo${element.commentId}" hidden> ${element.commentId}</p>
                    <ul id="commentReplyList"></ul>
                </div>
            </div>
          `;
        commentsList.append(li);
        var commentReplyList = $("#commentReplyList");
        for (const e of element.reply) {
          var replyLi = document.createElement("li");
          replyLi.innerHTML = `
            <div class="Replycomment">
                <div class="ReplycommentUser">
                    <div class="Replyuser">
                      <p>${e.username}</p>
                    </div>
                </div>
                <div class="ReplycommentContent">
                    <div>${e.usercomment}</div>
                    <p class="replyButton" id="replyButton"> ${e.timestamp}&emsp;&emsp;Reply </p>
                    <p id="replyTo${e._id}" hidden> ${e._id}</p>
                    <ul id="commentReplyList"></ul>
                </div>
            </div>
          `;
          commentReplyList.append(replyLi);
        }
      }
    },
    error: function (error) {
      alert("something wrong!")
    }
  })
}