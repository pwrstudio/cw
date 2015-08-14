/*
 *
 *  Preload images
 *
 */

$.fn.preload = function () {
  $('<img/>')[0].src = this;
};

/*
 *
 *
 *
 *  DOCUMENT READY
 *
 *
 *
 */

$(document).ready(function () {

  /*
   *
   *  Sockets client
   *
   */

  var socket = io();

  socket.on('traced', function (msg) {
    if (msg !== null) {
      $("#trace-container").append(MyApp.templates.trace(msg));
    }
  });

  $(document).on("click", ".image-link", function (e) {
    e.preventDefault();
    var container = $(this).next(".thumb-container");
    container.slideToggle(1000);
    var large = container.children("img").data("large");
    $('<img/>')[0].src = large;
  });

  $('.lightBox').on('click', function (e) {
    var largeLink = '<img src="' + $(this).data("large") + '">';
    $("#overlay").html(largeLink);
    $("#overlay").show();
    e.preventDefault();
  });

  $('#overlay').on('click', function (e) {
    $("#overlay").hide();
    e.preventDefault();
  });


});