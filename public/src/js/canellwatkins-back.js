(function () {

  "use strict";

  /*
   *
   *  Initialize datepicker
   *
   */

  function initDataPicker() {
    $('.input-daterange, .input-group.date').datepicker({
      autoclose: true,
      format: 'yyyy/mm/dd'
    });
  }

  /*
   *
   *  EXHIBITIONS render
   *
   */

  function getExhibitions() {
    $.ajax({
      type: 'GET',
      url: '/api/exhibition',
      dataType: 'json',
      success: function (data) {
        $('#exhibition-container').fadeOut(function () {
          $(this)
            .html(MyApp.templates.exhibition(data))
            .fadeIn();
          initDataPicker();
        });
      }
    });
  }

  /*
   *
   *  PUBLICATIONS render
   *
   */

  function getPublications() {
    $.ajax({
      type: 'GET',
      url: '/api/publication',
      dataType: 'json',
      success: function (data) {
        $('#publication-container').fadeOut(function () {
          $(this)
            .html(MyApp.templates.publication(data))
            .fadeIn();
          $(".sortable-publication").sortable({
            cursor: "ns-resize",
            axis: "y",
            containment: "parent",
            delay: 150,
            scroll: true,
            scrollSensitivity: 80,
            scrollSpeed: 3
          });
        });
      }
    });
  }

  /*
   *
   *  CONTENT render
   *
   */

  function getContent() {
    $.ajax({
      type: 'GET',
      url: '/api/content/get/-1',
      dataType: 'json',
      success: function (data) {
        $('#content-container').fadeOut(function () {
          $(this)
            .html(MyApp.templates.content(data))
            .fadeIn();
          $(".sortable-content").sortable({
            cursor: "ns-resize",
            axis: "y",
            containment: "parent",
            delay: 150,
            scroll: true,
            scrollSensitivity: 80,
            scrollSpeed: 3,
            sort: function (event, ui) {
              var currentScrollTop = $(window).scrollTop(),
                topHelper = ui.position.top,
                delta = topHelper - currentScrollTop;
              setTimeout(function () {
                $(window).scrollTop(currentScrollTop + delta);
              }, 5);
            }
          });
        });
      }
    });
  }


  /*
   *
   *  Load forms
   *
   */

  function loadImageForm() {
    $("#image-form-container").html(MyApp.templates.imageform());
  }

  function loadAudioForm() {
    $("#audio-form-container").html(MyApp.templates.audioform());
  }

  function loadVideoForm() {
    $("#video-form-container").html(MyApp.templates.videoform());
  }

  function loadTextForm() {
    $("#text-form-container").html(MyApp.templates.textform());
  }

  function loadExhibitionForm() {
    $("#exhibition-form-container").html(MyApp.templates.exhibitionform());
    initDataPicker();
  }

  function loadPublicationForm() {
    $("#publication-form-container").html(MyApp.templates.publicationform());
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

    //  Render all content
    getExhibitions();
    getPublications();
    getContent();

    // Load forms
    loadImageForm();
    loadTextForm();
    loadExhibitionForm();
    loadPublicationForm();
    loadAudioForm();
    loadVideoForm();

    /*
     *
     *  Slide out for edit form
     *
     */

    $(document).on("click", ".slider", function (e) {
      e.preventDefault();
      $(this)
        .next(".editContainer")
        .slideToggle();
    });

    /*
     *
     *  image overlay
     *
     */

    $(document).on("click", ".full-size-image", function (e) {
      e.preventDefault();
      $("#overlay")
        .html('<img src="' + $(this).attr("href") + '">')
        .show();
    });

    // Close image overlay
    $('#overlay').on('click', function (e) {
      $(this).hide();
    });


    $(document).on('click', '.update-content-order', function (e) {
      e.preventDefault();
      $(".sort-container.content").each(function () {
        $.ajax({
          url: '/api/content/updateorder/' + $(this).data('i') + "/" + $(this).index(),
          type: 'POST',
          dataType: "json",
          contentType: false,
          cache: false,
          processData: false,
          success: function (data, textStatus, jqXHR) {
            $.notify({
              message: 'Content order changed'
            }, {
              type: 'success'
            });
          },
          error: function (jqXHR, textStatus, errorThrown) {}
        });
      });
    });

    $(document).on('click', '.update-publication-order', function (e) {
      e.preventDefault();
      $(".sort-container.publication").each(function () {
        $.ajax({
          url: '/api/publication/updateorder/' + $(this).data('i') + "/" + $(this).index(),
          type: 'POST',
          dataType: "json",
          contentType: false,
          cache: false,
          processData: false,
          success: function (data, textStatus, jqXHR) {
            $.notify({
              message: 'Publication order changed'
            }, {
              type: 'success'
            });
          },
          error: function (jqXHR, textStatus, errorThrown) {}
        });
      });
    });

    /*
     *
     *  DELETE image
     *
     */

    $(document).on('click', '.delete.image', function () {
      $.ajax({
        type: 'DELETE',
        url: '/api/content/del/image/' + $(this).data('id'),
        dataType: 'json',
        success: function (data) {
          $.notify({
            message: 'Image deleted'
          }, {
            type: 'success'
          });
          getContent();
        }
      });
    });

    /*
     *
     *  DELETE audio
     *
     */

    $(document).on('click', '.delete.audio', function () {
      $.ajax({
        type: 'DELETE',
        url: '/api/content/del/audio/' + $(this).data('id'),
        dataType: 'json',
        success: function (data) {
          $.notify({
            message: 'Audio deleted'
          }, {
            type: 'success'
          });
          getContent();
        }
      });
    });

    /*
     *
     *  DELETE video
     *
     */

    $(document).on('click', '.delete.video', function () {
      $.ajax({
        type: 'DELETE',
        url: '/api/content/del/video/' + $(this).data('id'),
        dataType: 'json',
        success: function (data) {
          $.notify({
            message: 'Audio deleted'
          }, {
            type: 'success'
          });
          getContent();
        }
      });
    });

    /*
     *
     *  DELETE text
     *
     */

    $(document).on('click', '.delete.text', function () {
      $.ajax({
        type: 'DELETE',
        url: '/api/content/del/text/' + $(this).data('id'),
        dataType: 'json',
        success: function (data) {
          $.notify({
            message: 'Text deleted'
          }, {
            type: 'success'
          });
          getContent();
        }
      });
    });

    /*
     *
     *  DELETE Container
     *
     */

    $(document).on('click', '.delete.cont', function () {
      $.ajax({
        type: 'DELETE',
        url: '/api/container/' + $(this).data('id'),
        dataType: 'json',
        success: function (data) {
          $.notify({
            message: 'Item deleted'
          }, {
            type: 'success'
          });
          getExhibitions();
          getPublications();
        }
      });
    });

    /*
     *
     *  Submit ajax form
     *
     */

    $(document).on('submit', '.ajaxForm', function (e) {

      e.preventDefault();

      $(".ajaxForm").validate({
        rules: {
          year: {
            required: true,
            date: true
          }
        }
      });

      var formObj = $(this),
        spinner = $(this).parent().find(".spinner"),
        formURL = formObj.attr("action"),
        formData = new FormData(this);

      spinner.show();
      formObj.hide();

      $.ajax({
        url: formURL,
        type: 'POST',
        data: formData,
        dataType: "json",
        mimeType: "multipart/form-data",
        contentType: false,
        cache: false,
        processData: false,
        success: function (data, textStatus, jqXHR) {


          $.notify({
            message: 'Sucessfully added'
          }, {
            type: 'success'
          });

          if (data.result === "publication") {

            getPublications();
            loadPublicationForm();
            loadTextForm();
            $('a[href="#publication_list"]').tab('show');
            spinner.hide();
            formObj.find("input").val('');
            formObj.show();

          } else if (data.result === "exhibition") {

            getExhibitions();
            loadExhibitionForm();
            $('a[href="#exhibition_list"]').tab('show');
            spinner.hide();
            formObj.find("input").val('');
            formObj.show();

          } else if (data.result === "content") {

            getContent();
            loadImageForm();
            loadVideoForm();
            loadAudioForm();

            $('a[href="#content_list"]').tab('show');
            spinner.hide();
            formObj.find("input").val('');
            formObj.show();

          }

        },

        error: function (jqXHR, textStatus, errorThrown) {}

      });
    });

    /*
     *
     *  Submit ajax form for updating
     *
     */

    $(document).on('submit', '.ajaxFormUpdate', function (e) {

      e.preventDefault();

      var formObj = $(this),
        formURL = formObj.attr("action") + "/" + formObj.data("post-id"),
        formData = new FormData(this);

      $.ajax({
        url: formURL,
        type: 'POST',
        data: formData,
        dataType: "json",
        mimeType: "multipart/form-data",
        contentType: false,
        cache: false,
        processData: false,
        success: function (data, textStatus, jqXHR) {

          $.notify({
            message: 'Item updated'
          }, {
            type: 'success'
          });

          if (data.result === "publication") {

            getPublications();
            $('a[href="#publication_list"]').tab('show');

          } else if (data.result === "exhibition") {

            getExhibitions();
            $('a[href="#exhibition_list"]').tab('show');

          } else if (data.result === "content") {

            getContent();
            $('a[href="#content_list"]').tab('show');

          }

          formObj.parent(".editContainer").slideToggle();

        },
        error: function (jqXHR, textStatus, errorThrown) {}
      });
    });

  });

}());