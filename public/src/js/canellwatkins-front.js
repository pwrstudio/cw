$(document).ready(function () {

	var socket = io();

	socket.on('traced', function (msg) {
		if (msg != null) {
			var source = $("#trace-template").html();
			var template = Handlebars.compile(source);
			$("#trace-container").append(template(msg));
		}
	});

	$(document).on("click", ".image-link", function (e) {
		e.preventDefault();
		$(this).parent().html("<a href='" + $(this).data("large") + "' class='image-thumb'><img class='image-thumb' src='" + $(this).attr("href") + "' alt='"  + $(this).data("title") + "'></a>");
	});
	
	$(document).on("click", ".image-thumb", function (e) {
//		e.preventDefault();
//		$(this).parent().html("<img class='image-thumb' src='" + $(this).attr("href") + "'>");
		
	});

});