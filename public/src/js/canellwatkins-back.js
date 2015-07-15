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

$(document).ready(function () {

  getExhibitions();
  getPublications();
  getContent();

  $.fn.slideFadeToggle = function (speed, easing, callback) {
    return this.animate({
      opacity: 'toggle',
      height: 'toggle'
    }, speed, easing, callback);
  };

  $(document).on("click", ".list-group-item", function (e) {
    e.preventDefault();
    var container = $(this).next(".editContainer");
    container.slideFadeToggle();
  });

  $('.input-daterange, .input-group.date').datepicker({
    autoclose: true,
    format: 'yyyy/mm/dd'
  });

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
        }
        spinner.hide();
        formObj.show();
      },
      error: function (jqXHR, textStatus, errorThrown) {}
    });
    e.preventDefault();
  });

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
        formObj.parent(".editContainer").slideFadeToggle();
      },
      error: function (jqXHR, textStatus, errorThrown) {}
    });
    e.preventDefault();
  });

});