$(document).ready(function () {

  var socket = io();

  socket.on('traced', function (msg) {
    if (msg != null) {
      var source = $("#trace-template").html();
      var template = Handlebars.compile(source);
      $("#trace-container").append(template(msg));
    }
  });

});