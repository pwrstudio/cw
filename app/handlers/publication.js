/*
 *
 *  Publication handler
 *
 */

(function () {

  "use strict";


  var formidable = require('formidable'),
    Container = require('../models/Container.js'),
    rimraf = require('rimraf'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    validator = require('validator'),
    easyimg = require('easyimage');

  function resizeContent(newPath, dir, fileName) {

    // Thumbnail
    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "thumbnail-" + fileName,
      width: 300,
      height: 300,
      quality: 70,
    });

    // Large
    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "large-" + fileName,
      width: 800,
      height: 800,
      quality: 80,
    });

    // Small
    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "small-" + fileName,
      width: 450,
      height: 450,
      quality: 80,
    });
  }


  /*
   *
   *  Initialize data directory
   *
   */

  var dataDir = '/public/data',
    fullDir = appRoot + dataDir;

  fs.existsSync(fullDir) || fs.mkdirSync(fullDir);



  /*
   *
   *  Get all publication
   *
   */

  exports.get_publication = function (req, res) {
    Container.find().sort({
      start_date: -1
    }).exec(function (err, publications) {
      res.json(publications);
    });
  };


  /*
   *
   *  Add publication
   *
   */

  exports.post_publication = function (req, res) {

    var form = new formidable.IncomingForm(),
      now = Date.now(),
      dir = fullDir + '/' + now;

    fs.mkdirSync(dir);

    form.parse(req, function (err, fields, files) {

      var publication = new Container();
      publication.title = fields.title;
      publication.link = fields.link;
      publication.publisher = fields.publisher;
      publication.start_date = fields.start_date;
      publication.start_date_pretty = fields.start_date;

      if (files.pic.size !== 0) {

        var fullFilePath = '/data/' + now + '/' + files.pic.name;

        var newPath = dir + '/' + files.pic.name;

        fs.renameSync(files.pic.path, newPath);

        resizeContent(newPath, dir, files.pic.name);

        var stats = fs.statSync(newPath);
        var fileSizeInKilobytes = stats.size / 1000.0;

        publication.image.size = fileSizeInKilobytes;
        publication.image.url = fullFilePath;
        publication.image.thumb = '/data/' + now + '/' + "thumbnail-" + files.pic.name;
        publication.image.large = '/data/' + now + '/' + "large-" + files.pic.name;
        publication.image.small = '/data/' + now + '/' + "small-" + files.pic.name;

      }

      if (files.sound.size !== 0) {

        var fullSndPath = '/data/' + now + '/' + files.sound.name;

        var newSndPath = dir + '/' + files.sound.name;

        fs.renameSync(files.sound.path, newSndPath);
        var stats = fs.statSync(newSndPath);
        var sndSizeInKilobytes = stats.size / 1000.0;

        publication.sound.url = fullSndPath;
        publication.sound.size = sndSizeInKilobytes;

      }

      publication.save(function (err) {
        res.json({
          result: 'publication'
        });
      });

    });

  };


  /*
   *
   *  Update publication
   *
   */

  exports.update_publication = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

      Container.findById(req.params.id, function (err, publication) {

        if (publication != null || publication != undefined) {

          publication.title = fields.title;
          publication.link = fields.link;
          publication.publisher = fields.publisher;
          publication.start_date = fields.start_date;
          publication.start_date_pretty = fields.start_date;

          publication.save(function (err) {
            res.json({
              result: 'publication'
            });
          });

        }
      });

    });

  };

  /*
   *
   *  Add text
   *
   */

  //  exports.post_text_content = function (req, res) {
  //
  //    var form = new formidable.IncomingForm();
  //
  //    form.parse(req, function (err, fields) {
  //
  //      var content = new Content();
  //      content.public = fields.public;
  //      content.date = new Date();
  //      content.year = fields.year;
  //      content.text.body = fields.text;
  //      content.title = fields.title;
  //      content.text.author = fields.author;
  //      content.text.link = fields.link;
  //      content.user = req.user.email;
  //
  //      content.save(function (err) {
  //        res.json({
  //          result: 'content'
  //        });
  //      });
  //
  //    });
  //
  //  };
  //
  //
  //  /*
  //   *
  //   *  Update text
  //   *
  //   */
  //
  //  exports.update_text_content = function (req, res) {
  //
  //    var form = new formidable.IncomingForm();
  //
  //    form.parse(req, function (err, fields) {
  //
  //      Content.findById(req.params.id, function (err, content) {
  //
  //        if (content !== null && content !== undefined) {
  //
  //          content.public = fields.public;
  //          content.year = fields.year;
  //          content.text.body = fields.text;
  //          content.title = fields.title;
  //          content.text.author = fields.author;
  //          content.text.link = fields.link;
  //          content.user = req.user.email;
  //
  //          content.save(function (err) {
  //            res.json({
  //              result: 'content'
  //            });
  //          });
  //        }
  //      });
  //
  //    });
  //
  //  };

  /*
   *
   *  Delete text
   *
   */

  //  exports.delete_text_content = function (req, res) {
  //    Content.remove({
  //      _id: req.params.id
  //    }, function (err, content) {
  //      res.json({
  //        message: 'Success'
  //      });
  //    });
  //  };

}());
