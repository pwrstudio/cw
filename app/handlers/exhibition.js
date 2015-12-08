/*
 *
 *  Exhibition handler
 *
 */

(function () {

  "use strict";

  var formidable = require('formidable'),
    Container = require('../models/Container.js');

  /*
   *
   *  Get all exhibitions
   *
   */

  exports.get_exhibition = function (req, res) {
    Container.find().sort({
      start_date: -1
    }).exec(function (err, exhibitions) {
      res.json(exhibitions);
    });
  };


  /*
   *
   *  Add exhibition
   *
   */

  exports.post_exhibition = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {

      if (fields) {

        var exhibition = new Container();
        exhibition.title = fields.title;
        exhibition.location = fields.location;
        exhibition.link = fields.link;
        exhibition.start_date = fields.start_date;
        exhibition.end_date = fields.end_date;
        exhibition.start_date_pretty = fields.start_date;
        exhibition.end_date_pretty = fields.end_date;
        if (fields.radios == "solo") {
          exhibition.solo = true;
        }
        if (fields.radios == "group") {
          exhibition.group = true;
        }

        exhibition.save(function (err) {
          res.json({
            result: "exhibition"
          });
        });
      }

    });

  };


  /*
   *
   *  Update exhibition
   *
   */

  exports.update_exhibition = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

      console.log(fields);

      Container.findById(req.params.id, function (err, exhibition) {

        if (exhibition) {

          exhibition.title = fields.title;
          exhibition.location = fields.location;
          exhibition.link = fields.link;
          exhibition.start_date = fields.start_date;
          exhibition.end_date = fields.end_date;
          exhibition.start_date_pretty = fields.start_date;
          exhibition.end_date_pretty = fields.end_date;
          if (fields.radios == "solo") {
            exhibition.solo = true;
          }
          if (fields.radios == "group") {
            exhibition.group = true;
          }

          exhibition.save(function (err) {
            res.json({
              result: "exhibition"
            });
          });
        }
      });

    });

  };

}());