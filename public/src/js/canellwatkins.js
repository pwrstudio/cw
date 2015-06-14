    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //    function getDroplettes() {
    //      $.ajax({
    //        type: 'GET',
    //        url: '/api/droplette/get/10',
    //        dataType: 'json',
    //        success: function (data) {
    //          $('#dropletteContainer').fadeOut(function () {
    //            var source = $("#droplette-template").html();
    //            var template = Handlebars.compile(source);
    //            $("#dropletteContainer").html(template(data));
    //            $('#dropletteContainer').fadeIn();
    //            $(".draggableItem").draggable({
    //              opacity: 0.7,
    //              helper: "clone",
    //              scroll: false,
    //              stack: ".draggableItem"
    //            });
    //            $(".droppable").droppable({
    //              activeClass: "activeDrag",
    //              hoverClass: "hoverDrag",
    //              drop: function (event, ui) {
    //                var drag = $(ui.draggable);
    //                if (drag.hasClass("draggableItem")) {
    //                  movePoint($(this).attr("id"), drag.find("img").attr("id"));
    //                } else if (drag.hasClass("draggableTag")) {
    //                  $(this).addClass("droppedDrag");
    //                  addTag($(this).attr("id"), drag.attr("id"));
    //                }
    //              }
    //            });
    //          });
    //        }
    //      });
    //    }

    Dropzone.options.fileDrop = {
      init: function () {
        this.on("complete", function (file) {
          getDroplettes();
        });
      }
    };

    //    function addTag(droplette_id, tag_id) {
    //      $.ajax({
    //        type: 'POST',
    //        url: '/api/tag/' + droplette_id + '/' + tag_id,
    //        dataType: 'json',
    //        success: function (data) {
    //          console.log(data.tags);
    //        }
    //      });
    //    }

    $(document).ready(function () {

//      $('#add_text a').click(function (e) {
//        e.preventDefault()
//        $(this).tab('show')
//      })
//
//      $('#add_image a').click(function (e) {
//        e.preventDefault()
//        $(this).tab('show')
//      })
//
//      $('#list_content a').click(function (e) {
//        e.preventDefault()
//        $(this).tab('show')
//      })
//
//      $('#collections a').click(function (e) {
//        e.preventDefault()
//        $(this).tab('show')
//      })

      //      getDroplettes();

      //      $(".draggableTopLayer").draggable({
      //        stack: ".draggableTopLayer",
      //        scroll: false
      //      });

      //      $(".draggableTopLayer").each(function () {
      //        $(this).css("top", getRandomInt(5, 95) + "%");
      //        $(this).css("left", getRandomInt(5, 95) + "%");
      //      });
      //      

      //
      //      $.get("http://93.95.228.60:8080/check_session", function (data) {
      //        if (data != "false") {
      //          $("#loggedInUser").html(data);
      //          $(".admin").show();
      //          getTags();
      //        } else {
      //          $("#login").show();
      //        }
      //      });

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
//            getDroplettes();
//            getTags();
            alert(data);
            formObj.find("input").val('');
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