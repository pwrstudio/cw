(function () {

  "use strict";

  /*
   *
   *  Generate random
   *
   */

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*
   *
   * Convertnewlines
   *
   */

  function replaceNewlines(str) {
    return str.replace(new RegExp('\n', 'g'), '<br>');
  }

  /*
   *
   *  Global
   *
   */

  var traceResults = [],
    ContextClass = (window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext ||
      window.msAudioContext);

  if (ContextClass) {
    // Web Audio API is available.
    var context = new ContextClass(),
      gainNode,
      oscillator;

    oscillator = context.createOscillator();
    gainNode = context.createGain ? context.createGain() : context.createGainNode();

    oscillator.frequency.value = getRandomInt(500, 13500);
    console.log(oscillator.frequency.value);
    gainNode.gain.value = 0.05;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = "sine";

  } else {
    console.log("error");
  }

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
    if (a.index > b.index) {
      return -1;
    }
    if (a.index < b.index) {
      return 1;
    }
    return 0;
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

    oscillator[oscillator.start ? 'start' : 'noteOn'](0);

    /*
     *
     *  Sockets client
     *
     */

    var socket = io();

    socket.on('tracedone', function (msg) {
      setTimeout(function () {
        $("#tracestart-container").html(MyApp.templates.tracestart(msg));
        setTimeout(function () {
          oscillator.stop(0);
          renderTraceQ();
          $("#counterOverlay").hide();
          $(".content-columns").show();
          $("#cable-length").html(msg.total);
        }, 1500);
      }, 700);

    });

    socket.on('traced', function (msg) {
      //      console.log("traced");
      if (msg !== null) {
        traceResults.push(msg);
        $("#tracestart-container").html(MyApp.templates.tracestart(msg));
      }
    });

    /*
     *
     * Interaction
     *
     */

    $(document).on("click", ".image-link", function (e) {
      e.preventDefault();
      $(this)
        .parent(".thumb-container.fluid")
        .hide();
      $(".thumb-container").addClass("clicked");
      $("#overlay")
        .html('<img src="' +
          $(this).data("large") +
          '" style="background-image: url(' +
          $(this).data("pinky") +
          ')"><div class="caption-container strong">' +
          replaceNewlines($(this).data("caption")) +
          '</div>')
        .show();
    });


    $(document).on("click", ".slide-down-link", function (e) {
      e.preventDefault();
      $(this)
        .next(".thumb-container")
        .slideToggle(700);
    });


    $(document).on("click", ".menu-col", function (e) {
      e.preventDefault();
      $('body').animate({
        scrollTop: 0
      }, 'slow');
    });


    // Close image overlay
    $('#overlay').on('click', function (e) {
      e.preventDefault();
      $(".thumb-container").removeClass("clicked");
      $("#overlay").hide();
    });

    // Play sounds
    $(document).on('click', '.play', function (e) {
      e.preventDefault();
      $(this)
        .removeClass("play")
        .addClass("pause")
        .next("audio")[0]
        .play();
    });

    // Pause sounds
    $(document).on('click', '.pause', function (e) {
      e.preventDefault();
      $(this)
        .removeClass("pause")
        .addClass("play")
        .next("audio")[0]
        .pause()
        .currentTime = 0;
    });

  });

}());