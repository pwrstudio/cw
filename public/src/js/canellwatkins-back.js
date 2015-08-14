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
        $("#exhibition-container").html(MyApp.templates.exhibition(data));
        $('#exhibition-container').fadeIn();
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
        $("#publication-container").html(MyApp.templates.publication(data));
        $('#publication-container').fadeIn();
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
        $("#content-container").html(MyApp.templates.content(data));
        $('#content-container').fadeIn();
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
        $("#collection-container").html(MyApp.templates.collection(data));
        $("#collection-container").fadeIn();
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
        $("#collection-content-container").html(MyApp.templates.collectioncontent(data));
        $("#collection-content-container").fadeIn();
      });
    }
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

  //  Render all content
  getExhibitions();
  getPublications();
  getContent();
  getCollection();
  getCollectionContent();


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

  $(document).on("click", ".list-group-item", function (e) {
    e.preventDefault();
    var container = $(this).next(".editContainer");
    container.slideToggle();
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
   *  DELETE text click
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
   *  DELETE Container click
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
   *  DELETE Collection click
   *
   */

  $(document).on('click', '.delete.collection', function () {
    $.ajax({
      type: 'DELETE',
      url: '/api/collection/del/' + $(this).data('id'),
      dataType: 'json',
      success: function (data) {
        $.notify({
          message: 'Item deleted'
        }, {
          type: 'success'
        });
        getCollection();
      }
    });
  });


  /*
   *
   *  Mark selected content for collection
   *
   */

  $(document).on('click', '.collection-select-button', function () {
    var container = $(this).parent(".list-group-item");
    if (container.hasClass("selected")) {
      $(this).text("Add to collection");
    } else {
      $(this).text("Remove from collection");
    }
    $(this).parent(".list-group-item").toggleClass("selected");
  });


  /*
   *
   *  Submit new collection
   *
   */

  $(document).on('submit', '.collection-form', function (e) {

    e.preventDefault();

    $(this).validate({
      rules: {
        year: {
          required: true,
          date: true
        }
      }
    });

    var formObj = $(this);
    var spinner = $(this).parent().find(".spinner");
    spinner.show();
    formObj.hide();
    var formURL = formObj.attr("action");

    var selected = [];

    $(".selected").each(function () {
      selected.push($(this).attr("id"));
    });

    formData = {
      title: $("#main-title").val(),
      selected: selected
    };

    $.ajax({
      url: formURL,
      type: 'POST',
      data: formData,
      success: function (data, textStatus, jqXHR) {
        $.notify({
          message: 'Collection sucessfully created'
        }, {
          type: 'success'
        });
        getCollection();
        spinner.hide();
        formObj.show();
      },
      error: function (jqXHR, textStatus, errorThrown) {}
    });
  });


  /*
   *
   *  Submit ajax form
   *
   */

  $(document).on('submit', '.ajaxForm', function (e) {
    $(".ajaxForm").validate({
      rules: {
        year: {
          required: true,
          date: true
        }
      }
    });
    var formObj = $(this);
    var spinner = $(this).parent().find(".spinner");
    spinner.show();
    formObj.hide();
    var formURL = formObj.attr("action");
    var formData = new FormData(this);
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
          $('a[href="#publication_list"]').tab('show');
        } else if (data.result == "exhibition") {
          $.notify({
            message: 'Sucessfully added'
          }, {
            type: 'success'
          });
          getExhibitions();
          $('a[href="#exhibition_list"]').tab('show');
        } else if (data.result == "content") {
          $.notify({
            message: 'Sucessfully added'
          }, {
            type: 'success'
          });
          getContent();
          $('a[href="#content_list"]').tab('show');
        } else if (data.result == "collection") {
          $.notify({
            message: 'Collection sucessfully created'
          }, {
            type: 'success'
          });
          getCollection();
        }
        spinner.hide();
        formObj.show();
      },
      error: function (jqXHR, textStatus, errorThrown) {}
    });
    e.preventDefault();
  });


  /*
   *
   *  Submit ajax form for updating
   *
   */

  $(document).on('submit', '.ajaxFormUpdate', function (e) {
    var formObj = $(this);
    var formURL = formObj.attr("action") + "/" + formObj.data("post-id");
    var formData = new FormData(this);
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