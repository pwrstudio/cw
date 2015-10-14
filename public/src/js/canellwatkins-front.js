/*
 *
 *  Global
 *
 */

var traceResults = [];

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
    var gainNode;
    var oscillator;

    oscillator = context.createOscillator();
    gainNode = context.createGain ? context.createGain() : context.createGainNode();

    oscillator.frequency.value = getRandomInt(300, 15000);
    console.log(oscillator.frequency.value);
    gainNode.gain.value = 0.05;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = "sine";

} else {
    alert("error");
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
    if (a.index > b.index)
        return -1;
    if (a.index < b.index)
        return 1;
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
        console.log("traced");
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

    $(document).on("click", ".image-link.hidden", function (e) {
        e.preventDefault();
        $("#overlay").hide();
        $(".thumb-container").removeClass("clicked");
        $(this).removeClass("hidden");
        $(this).addClass("shown");
        var container = $(this).next(".thumb-container");
        container.css("left", getRandomInt(0, 80) + "%");
        container.css("top", getRandomInt(0, 75) + "%");
        container.slideToggle(700);
        var large = container.children("img").data("large");
        $('<img/>')[0].src = large;
    });

    $(document).on("click", ".image-link.shown", function (e) {
        e.preventDefault();
        $(this).removeClass("shown");
        $(this).addClass("hidden");
        $(this).next(".thumb-container").slideToggle(700);
    });

    $(document).on("click", ".slide-down-link", function (e) {
        e.preventDefault();
        $(this).next(".thumb-container").slideToggle(700);
    });


    $(document).on("click", ".menu-col", function (e) {
        e.preventDefault();
        $('body').animate({
            scrollTop: 0
        }, 'slow');
        return false;
    });

    $('.lightBox').on('click', function (e) {
        $(this).parent(".thumb-container.fluid").hide();
        $(".thumb-container").addClass("clicked");
        var largeLink = '<img src="' + $(this).data("large") + '"><div class="caption-container strong">' + $(this).attr("alt") + '</div>';
        $("#overlay").html(largeLink);
        $("#overlay").show();
        e.preventDefault();
    });

    $('#overlay').on('click', function (e) {
        $(".thumb-container").removeClass("clicked");
        $("#overlay").hide();
        e.preventDefault();
    });

    $(document).on('click', '.play', function (e) {
        e.preventDefault();
        $(this).removeClass("play").addClass("pause");
        console.log("play");
        $(this).next("audio")[0].play();
    });

    $(document).on('click', '.pause', function (e) {
        e.preventDefault();
        $(this).removeClass("pause").addClass("play");
        console.log("pause");
        $(this).next("audio")[0].pause();
        $(this).next("audio")[0].currentTime = 0;
    });


});
