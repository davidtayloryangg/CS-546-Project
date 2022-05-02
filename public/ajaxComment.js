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

var buttonFlag = false;
$('body').on('click', '.replyButton', function (event) {
  buttonFlag = !buttonFlag;
  var username = $("#commentUsername").text();
  var commentID = event.target.id;
  var formID = "#newReplyForm" + event.target.id;
  var formName = "#name" + event.target.id;
  console.log(event.target.id);
  var name = "To " + $(formName).text();
  if (buttonFlag) {
    $(".newReplyForm").empty();
    $(formID).append(`
      <div class="newReplyComment">
          <div class="replyCommentUser">
              <div class="replyCommentUsername" id="replyCommentUsername">
                ${username}
              </div>
          </div>
          <div class="replyCommentContent">
              <div class="replyCommentContentTxt">
                  <form action="##" method="POST" id="newReplyCommentForm">
                      <textarea type="text" id="newCommentTxt" name="newCommentTxt" placeholder="${name}"></textarea>
                  </form>
                  
              </div>
              <div class="replyCommentContentBtn">
                <button class="replyCommentButton" id="${commentID}"> Review </button>
              </div>
          </div>
      </div>
    `);

  } else $(".newReplyForm").empty();
})

$("body").on("click", ".replyCommentButton", function (event) {
  var commentID = event.target.id;
  $.ajax({
    url: "http://localhost:3000/parks/id/comments/reply/" + commentID,
    type: "post",
    dataType: "json",
    data: $("#newReplyCommentForm").serialize(),
    success: function (commentInfo) {
      loadComments();
      buttonFlag = !buttonFlag;
    },
    error: function (error) {
      alert("you have to log in!")
    }
  })

})

$("body").on("click", ".likeButton", function () {
  alert("sss");
})

$("body").on("click", ".dislikeButton", function () {
  alert("disss");
})

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
                    <p> ${element.timestamp} &emsp;&emsp;
                        <img class="likeButton" src="/public/img/like.png"</img>
                        <img class="dislikeButton" src="/public/img/dislike.png"</img>
                        <b class="replyButton" id="${element.commentId}">Reply</b>
                    </p>
                    <b id="name${element.commentId}" hidden>${element.username}</b>
                    <ul id="commentReplyList${element.commentId}"></ul>
                    <div id="newReplyForm${element.commentId}" class="newReplyForm"></div>
                </div>
            </div>
          `;
        commentsList.append(li);
        var listname = "#commentReplyList" + element.commentId;
        var commentReplyList = $(listname);
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
                    <p> ${element.timestamp} &emsp;&emsp;
                        <img class="likeButton" src="/public/img/like.png"</img>
                        <img class="dislikeButton" src="/public/img/dislike.png"</img>
                        <b class="replyButton" id="${e._id}">Reply</b>
                    </p>
                    <b id="name${e._id}" hidden>${e.username}</b>
                    
                </div>
            </div>
            <div id="newReplyForm${e._id}" class="newReplyForm"></div>
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