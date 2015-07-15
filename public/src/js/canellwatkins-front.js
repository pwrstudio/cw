$.fn.preload = function () {
  $('<img/>')[0].src = this;
};

$(document).ready(function () {

  $.fn.slideFadeToggle = function (speed, easing, callback) {
    return this.animate({
      opacity: 'toggle',
      height: 'toggle'
    }, speed, easing, callback);
  };

  var socket = io();

  socket.on('traced', function (msg) {
    if (msg !== null) {
      var source = $("#trace-template").html();
      var template = Handlebars.compile(source);
      $("#trace-container").append(template(msg));
    }
  });

  $(document).on("click", ".image-link", function (e) {
    e.preventDefault();
    var container = $(this).next(".thumb-container");
    container.slideFadeToggle();
    var large = container.children("img").data("large");
    console.log(large);
    $('<img/>')[0].src = large;
  });

  $('.lightBox').on('click', function (e) {
    $("body").addClass("no-scroll");
    var largeLink = '<img src="' + $(this).data("large") + '">';
    $("#overlay").html(largeLink);
    $("#overlay").fadeIn();
    e.preventDefault();
  });

  $('#overlay').on('click', function (e) {
    $("body").removeClass("no-scroll");
    $("#overlay").fadeOut();
    e.preventDefault();
  });

  var spaceOut = function () {
    var space = parseInt($(".space").css("margin-top")) + 10;
    $(".space").css("margin-top", space + "px");
    $(".space").css("margin-bottom", space + "px");
  };

  setInterval(spaceOut, 60000);

});