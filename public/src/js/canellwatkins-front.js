/*
 *
 *  Global
 *
 */

var traceResults = [];


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
 *  Compare
 *
 */

function compare(a, b) {
  if (a.index > b.index)
    return -1;
  if (a.index < b.index)
    return 1;
  return 0;
}


/*
 *
 *  Count-up to distance
 *
 */

function startTimer(distance) {
  console.log(distance);
  $("#startUpOverlay").css("transition-duration", distance + "ms");
  $("#startUpOverlay").css("-webkit-transition-duration", distance + "ms");
  var counter = setTimeout(function () {
    clearInterval(counter);
    renderTraceQ();
    $("#counterOverlay").hide();
    $(".content-columns").show();
  }, distance);
}

/*
 *
 *  Render traceroute
 *
 */

function renderTraceQ() {

  traceResults.sort(compare);

  traceResults.forEach(function (arrayItem) {
    $("#trace-container").append(MyApp.templates.trace(arrayItem));
  });

}


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

  $(".loadtime").text("Document loaded in " + (Date.now() - timerStart) + "ms");

  /*
   * Play Sound
   */

  var playerOne = document.getElementById("startUpSound");
  playerOne.play();

  $("#startUpOverlay").addClass("there");

  /*
   *
   *  Sockets client
   *
   */

  var socket = io();

  socket.on('traced', function (msg) {
    if (msg !== null) {
      traceResults.push(msg);
      $("#tracestart-container").html(MyApp.templates.tracestart(msg));
    }
  });

  socket.on('tracedone', function (msg) {
    setTimeout(function () {
      $("#tracestart-container").html("Roundtrip time: " + msg.roundtrip + "ms")
    }, 500);
  });

  console.log($("#distance").data("distance"));
  startTimer($("#distance").data("distance"));

  $(document).on("click", ".image-link", function (e) {
    e.preventDefault();
    var container = $(this).next(".thumb-container");
    container.slideToggle(1000);
    var large = container.children("img").data("large");
    $('<img/>')[0].src = large;
  });

  $('.lightBox').on('click', function (e) {
    $(".thumb-container").addClass("clicked");
    //    $(this).parent().addClass("clicked");
    var largeLink = '<img src="' + $(this).data("large") + '">';
    $("#overlay").html(largeLink);
    $("#overlay").show();
    e.preventDefault();
  });

  $('#overlay').on('click', function (e) {
    $(".thumb-container").removeClass("clicked");
    $("#overlay").hide();
    e.preventDefault();
  });


});