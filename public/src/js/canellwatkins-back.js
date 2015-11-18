(function () {

  "use strict";

  /*
   *
   *  Random number generator
   *
   */

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
        });
      }
    });
  }


  /*
   *
   *  COLLECTIONS render
   *
   */

  function getCollection() {
    $.ajax({
      type: 'GET',
      url: '/api/collection/',
      dataType: 'json',
      success: function (data) {
        $('#collection-container').fadeOut(function () {
          $(this)
            .html(MyApp.templates.collection(data))
            .fadeIn();
        });
      }
    });
  }


  /*
   *
   *  CONTENT in COLLECTION list render
   *
   */

  function getCollectionContent() {
    $.ajax({
      type: 'GET',
      url: '/api/content/get/-1',
      dataType: 'json',
      success: function (data) {
        $('#collection-content-container').fadeOut(function () {
          $(this)
            .html(MyApp.templates.collectioncontent(data))
            .fadeIn();
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

  function loadTextForm() {
    $("#text-form-container").html(MyApp.templates.textform());
  }

  function loadCollectionForm() {
    $("#collection-form-container").html(MyApp.templates.collectionform());
  }

  function loadExhibitionForm() {
    $("#exhibition-form-container").html(MyApp.templates.exhibitionform());
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
    getCollection();
    getCollectionContent();

    // Load forms
    loadImageForm();
    loadTextForm();
    loadCollectionForm();
    loadExhibitionForm();
    loadPublicationForm();


    /*
     *
     *  Initialize datepicker
     *
     */

    $('.input-daterange, .input-group.date').datepicker({
      autoclose: true,
      format: 'yyyy/mm/dd'
    });

    $('body').on('focus', ".datepicker_recurring_start", function () {
      $(this).datepicker();
    });


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

    /*
     *
     *  DELETE image click
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
          getCollectionContent();
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
          getCollectionContent();
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
        spinner = $(this)
        .parent()
        .find(".spinner"),
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

          formObj.find("input").val('');

          if (data.result == "publication") {
            $.notify({
              message: 'Sucessfully added'
            }, {
              type: 'success'
            });

            getPublications();
            loadPublicationForm();
            $('a[href="#publication_list"]').tab('show');

          } else if (data.result == "exhibition") {

            $.notify({
              message: 'Sucessfully added'
            }, {
              type: 'success'
            });

            getExhibitions();
            loadExhibitionForm();
            $('a[href="#exhibition_list"]').tab('show');

          } else if (data.result == "content") {
            $.notify({
              message: 'Sucessfully added'
            }, {
              type: 'success'
            });

            getContent();
            loadImageForm();
            loadTextForm();

            $('a[href="#content_list"]').tab('show');

          }

          spinner.hide();
          formObj.show();

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
          if (data.result == "publication") {
            $.notify({
              message: 'Publication updated'
            }, {
              type: 'success'
            });
            getPublications();
            $('a[href="#publication_list"]').tab('show');
          } else if (data.result == "exhibition") {
            $.notify({
              message: 'Exhibition updated'
            }, {
              type: 'success'
            });
            getExhibitions();
            $('a[href="#exhibition_list"]').tab('show');
          } else if (data.result == "content") {
            $.notify({
              message: 'Post updated'
            }, {
              type: 'success'
            });
            getContent();
            $('a[href="#content_list"]').tab('show');
          }
          formObj.parent(".editContainer").slideToggle();
        },
        error: function (jqXHR, textStatus, errorThrown) {}
      });
      e.preventDefault();
    });

  });

}());