    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getExhibitions() {
      $.ajax({
        type: 'GET',
        url: '/api/exhibition',
        dataType: 'json',
        success: function (data) {
          $('#exhibition-container').fadeOut(function () {
            var source = $("#exhibition-template").html();
            var template = Handlebars.compile(source);
            $("#exhibition-container").html(template(data));
            $('#exhibition-container').fadeIn();
          });
        }
      });
    }

    function getPublications() {
      $.ajax({
        type: 'GET',
        url: '/api/publication',
        dataType: 'json',
        success: function (data) {
          $('#publication-container').fadeOut(function () {
            var source = $("#publication-template").html();
            var template = Handlebars.compile(source);
            $("#publication-container").html(template(data));
            $('#publication-container').fadeIn();
          });
        }
      });
    }

    function getContent() {
      $.ajax({
        type: 'GET',
        url: '/api/content/get/10',
        dataType: 'json',
        success: function (data) {
          $('#content-container').fadeOut(function () {
            var source = $("#content-template").html();
            var template = Handlebars.compile(source);
            $("#content-container").html(template(data));
            $('#content-container').fadeIn();
          });
        }
      });
    }

    Dropzone.options.fileDrop = {
      init: function () {
        this.on("complete", function (file) {
          getDroplettes();
        });
      }
    };

    $(document).ready(function () {

      getExhibitions();
      getPublications();
      getContent();

      $('.input-daterange, .input-group.date').datepicker({
        autoclose: true,
        format: 'yyyy/mm/dd'
      });


      //      $(document).on('click', '.delete.image', function () {
      //        $.ajax({
      //          type: 'DELETE',
      //          url: 'http://93.95.228.60:8080/api/droplette/del/image/' + $(this).attr('id'),
      //          dataType: 'json',
      //          success: function (data) {
      //            window.location = "http://93.95.228.60:8080/";
      //          }
      //        });
      //      });
      //
      //      $(document).on('click', '.delete.text', function () {
      //        $.ajax({
      //          type: 'DELETE',
      //          url: 'http://93.95.228.60:8080/api/del/text/' + $(this).attr('id'),
      //          dataType: 'json',
      //          success: function (data) {
      //            window.location = "http://93.95.228.60:8080/";
      //          }
      //        });
      //      });

      $(document).on('submit', '.ajaxForm', function (e) {
        var formObj = $(this);
        var formURL = formObj.attr("action");
        var formData = new FormData(this);
        $.ajax({
          url: formURL,
          type: 'POST',
          data: formData,
          mimeType: "multipart/form-data",
          contentType: false,
          cache: false,
          processData: false,
          success: function (data, textStatus, jqXHR) {
            alert(data);
            formObj.find("input").val('');
            if (data.result == "publication") {
              getPublications();
              $('a[href="#publication_list"]').tab('show');
            } else if (data.result == "exhibition") {
              $('a[href="#exhibition_list"]').tab('show');
              getExhibitions();
            } else if (data.result == "content") {
              getContent();
            }

          },
          error: function (jqXHR, textStatus, errorThrown) {}
        });
        e.preventDefault();
      });

      //      $("body ").on("click ", ".small ", function () {
      //        $(this).removeClass("small ").addClass("large ");
      //        $("body ").animate({
      //          backgroundColor: "#000 ",
      //          color: "#FFF ",
      //        }, 1000, "easeInOutQuart");
      //      });
      //
      //      $("body ").on("click ", ".large ", function () {
      //        $(this).removeClass("large ").addClass("small ");
      //        if ($(".large ").size() == 0) {
      //          $("body ").animate({
      //            backgroundColor: "#FFF ",
      //            color: "#000",
      //          }, 1000, "easeInOutQuart");
      //        }
      //      });

      //      $(".draggable ").draggable({
      //        stack: ".draggable"
      //      });

      //      var windowWidth = $(window).width();
      //      var documentHeight = $(document).height();
      //
      //      $(".draggable ").each(function () {
      //        var elementHeight = 400;
      //        //        var elementHeight = $(this).height();
      //        //        var elementWidth = $(this).width();
      //        var elementWidth = 200;
      //        $(this).css("top", getRandomInt(0, (documentHeight - elementHeight)));
      //        $(this).css("left", getRandomInt(0, (windowWidth - elementWidth)));
      //      });

    });