
$(document).ready(function(){
  var postListButton = $(".postList");
  var postListContainer = $(".postListContainer");

  postListButton.on("click", function () {
    postListContainer.toggleClass("hidden");
  });


  $(".postListItem").click(function(){

    var postTitle = $(this).text();
    var postDate = $(this).attr("date");
    var postName = $(this).attr("name");
    var postContent = $(this).attr("postContent");
    
    $(".post-title .title").text(postTitle);
    $(".post-info .info").text(`${postDate}, ${postName}`);
    $(".post-content .content").text(`${postContent}`);
  })
});