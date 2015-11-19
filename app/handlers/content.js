(function () {

  "use strict";

  /*
   *
   *  CONTENT HANDLER
   *
   */

  var formidable = require('formidable'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    easyimg = require('easyimage'),
    escape = require('escape-html'),
    Content = require('../models/Content.js'),
    easyimg = require('easyimage'),
    dataDir = '/public/data',
    fullDir = appRoot + dataDir;

  fs.existsSync(fullDir) || fs.mkdirSync(fullDir);

  function resizeContent(newPath, dir, fileName) {

    // Thumbnail
    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "thumbnail-" + fileName,
      width: 300,
      height: 300,
      quality: 70
    });

    // Pinkynail
    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "pinkynail-" + fileName,
      width: 64,
      height: 64,
      quality: 20
    });

    // Large
    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "large-" + fileName,
      width: 800,
      height: 800,
      quality: 90
    });

    // Small
    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "small-" + fileName,
      width: 450,
      height: 450,
      quality: 80
    });
  }


  /*
   *
   *  Get all content
   *
   */

  exports.get_content = function (req, res) {
    Content.find().sort({
      date: -1
    }).exec(function (err, contents) {
      res.json(contents);
    });
  };

  /*
   *
   *  Get content by ID
   *
   */

  exports.get_content_by_id = function (req, res) {
    Content.findById(req.params.id, function (err, content) {
      res.json(content);
    });
  };

  // IMAGE
  // IMAGE
  // IMAGE
  // IMAGE
  // IMAGE

  /*
   *
   *  Add image
   *
   */

  exports.post_image_content = function (req, res) {

    var form = new formidable.IncomingForm(),
      now = Date.now(),
      dir = fullDir + '/' + now;

    fs.mkdirSync(dir);

    form.parse(req, function (err, fields, files) {

      var content = new Content(),
        stats,
        fileSizeInKilobytes,
        fullFilePath = '/data/' + now + '/' + files.pic.name,
        newPath = dir + '/' + files.pic.name;

      console.log(fields);
      console.log(files);

      fs.renameSync(files.pic.path, newPath);

      resizeContent(newPath, dir, files.pic.name);

      stats = fs.statSync(newPath);
      fileSizeInKilobytes = stats.size / 1000.0;

      content.date = new Date();
      content.year = fields.year;
      content.public = fields.public;
      content.image.frontpage = fields.frontpage;
      content.image.size = fileSizeInKilobytes;
      content.image.url = fullFilePath;
      content.image.thumb = '/data/' + now + '/' + "thumbnail-" + files.pic.name;
      content.image.large = '/data/' + now + '/' + "large-" + files.pic.name;
      content.image.small = '/data/' + now + '/' + "small-" + files.pic.name;
      content.image.pinky = '/data/' + now + '/' + "pinkynail-" + files.pic.name;
      content.title = fields.title;
      content.image.caption = fields.caption;

      console.log(content.image.caption);

      content.save(function (err) {
        res.json({
          result: 'content'
        });
      });
    });
  };

  /*
   *
   *  Update image
   *
   */

  exports.update_image_content = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {

      Content.findById(req.params.id, function (err, content) {

        if (content !== null && content !== undefined) {

          content.year = fields.year;
          content.public = fields.public;
          content.image.frontpage = fields.frontpage;
          content.title = fields.title;
          content.image.caption = fields.caption;

          content.save(function (err) {
            res.json({
              result: 'content'
            });
          });

        }
      });

    });
  };

  /*
   *
   *  Delete image
   *
   */

  exports.delete_image_content = function (req, res) {
    Content.findById(req.params.id, function (err, content) {
      if (content.image.url) {
        var p = content.image.url.split('/');
        rimraf(fullDir + '/' + p[2], function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

    Content.remove({
      _id: req.params.id
    }, function (err, content) {
      res.json({
        message: 'Success'
      });
    });
  };

  // AUDIO
  // AUDIO
  // AUDIO
  // AUDIO
  // AUDIO

  /*
   *
   *  Add audio
   *
   */

  exports.post_audio_content = function (req, res) {

    var form = new formidable.IncomingForm(),
      now = Date.now(),
      dir = fullDir + '/' + now;

    fs.mkdirSync(dir);

    form.parse(req, function (err, fields, files) {

      var content = new Content(),
        stats,
        sizeInKilobytes,
        fullPath = '/data/' + now + '/' + files.sound.name,
        newPath = dir + '/' + files.sound.name;

      console.log(fields);
      console.log(files);

      fs.renameSync(files.sound.path, newPath);
      var stats = fs.statSync(newPath),
        sizeInKilobytes = stats.size / 1000.0;

      content.date = new Date();
      content.year = fields.start_date;
      content.public = fields.public;
      content.audio.url = fullPath;
      content.audio.size = sizeInKilobytes;
      content.title = fields.title;
      content.audio.caption = fields.caption;

      content.save(function (err) {
        res.json({
          result: 'content'
        });
      });
    });
  };

  /*
   *
   *  Update audio
   *
   */

  exports.update_audio_content = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {

      Content.findById(req.params.id, function (err, content) {

        if (content) {

          content.year = fields.year;
          content.public = fields.public;
          content.title = fields.title;
          content.audio.caption = fields.caption;

          content.save(function (err) {
            res.json({
              result: 'content'
            });
          });

        }
      });

    });
  };

  /*
   *
   *  Delete audio
   *
   */

  exports.delete_audio_content = function (req, res) {
    Content.findById(req.params.id, function (err, content) {
      if (content.audio.url) {
        var p = content.audio.url.split('/');
        rimraf(fullDir + '/' + p[2], function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

    Content.remove({
      _id: req.params.id
    }, function (err, content) {
      res.json({
        message: 'Success'
      });
    });
  };

  // VIDEO
  // VIDEO
  // VIDEO
  // VIDEO
  // VIDEO

  /*
   *
   *  Add video
   *
   */

  exports.post_video_content = function (req, res) {

    var form = new formidable.IncomingForm(),
      now = Date.now(),
      dir = fullDir + '/' + now;

    fs.mkdirSync(dir);

    form.parse(req, function (err, fields, files) {

      var content = new Content(),
        stats,
        sizeInKilobytes,
        fullPath = '/data/' + now + '/' + files.sound.name,
        newPath = dir + '/' + files.sound.name;

      console.log(fields);
      console.log(files);

      fs.renameSync(files.sound.path, newPath);
      var stats = fs.statSync(newPath),
        sizeInKilobytes = stats.size / 1000.0;

      content.date = new Date();
      content.year = fields.start_date;
      content.public = fields.public;
      content.video.url = fullPath;
      content.video.size = sizeInKilobytes;
      content.title = fields.title;
      content.video.caption = fields.caption;

      content.save(function (err) {
        res.json({
          result: 'content'
        });
      });
    });
  };

  /*
   *
   *  Update video
   *
   */

  exports.update_video_content = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {

      Content.findById(req.params.id, function (err, content) {

        if (content) {

          content.year = fields.year;
          content.public = fields.public;
          content.title = fields.title;
          content.video.caption = fields.caption;

          content.save(function (err) {
            res.json({
              result: 'content'
            });
          });

        }
      });

    });
  };

  /*
   *
   *  Delete video
   *
   */

  exports.delete_video_content = function (req, res) {
    Content.findById(req.params.id, function (err, content) {
      if (content.video.url.split) {
        var p = content.image.url.split('/');
        rimraf(fullDir + '/' + p[2], function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

    Content.remove({
      _id: req.params.id
    }, function (err, content) {
      res.json({
        message: 'Success'
      });
    });
  };


}());