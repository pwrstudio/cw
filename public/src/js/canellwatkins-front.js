/*
 *
 *  Global
 *
 */

var traceResults = [];

/*
 *
 *  Set up sounds
 *
 */

var contextClass = (window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext);


if (contextClass) {
  // Web Audio API is available.
  var context = new contextClass();
  var gainValue = 0.1;
  var gainNode;
  var oscillator;

  console.log(context);

} else {
  alert("error");
}


/*
 *
 *  Frequency sweep
 *
 */

function sweep(freq1, freq2, duration) {

  currTime = context.currentTime;

  oscillator = context.createOscillator();
  gainNode = context.createGain ? context.createGain() : context.createGainNode();

  oscillator.frequency.value = freq1;

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.type = "sine";
  oscillator.start ? oscillator.start(0) : oscillator.noteOn(0);

  vol1 = 0.5;
  vol2 = 0;

  vol1 = Math.min(vol1, 0.5);
  vol2 = Math.min(vol2, 0.5);

  gainNode.gain.value = vol1;

  oscillator.frequency.linearRampToValueAtTime(freq1, currTime);
  gainNode.gain.linearRampToValueAtTime(vol1, currTime);
  oscillator.frequency.linearRampToValueAtTime(freq2, currTime + duration * 1);
  gainNode.gain.linearRampToValueAtTime(vol2, currTime + duration * 1);


  oscillator.stop ? oscillator.stop(currTime + duration * 1) : oscillator.noteOff(currTime + duration * 1);

};


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
  var timeInSeconds = distance / 2000;
  console.log(timeInSeconds);
  sweep(1, 15000, timeInSeconds);
  $("#startUpOverlay").css("transition-duration", timeInSeconds + "s");
  $("#startUpOverlay").css("-webkit-transition-duration", timeInSeconds + "s");
  var counter = setTimeout(function () {
    clearInterval(counter);
    renderTraceQ();
    $("#counterOverlay").hide();
    $(".content-columns").show();
  }, (timeInSeconds * 1000));
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
      $("#roundtrip").html(msg.roundtrip + "ms")
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