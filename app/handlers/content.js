var formidable = require('formidable');
var fs = require('fs');
var rimraf = require('rimraf');
var randtoken = require('rand-token');
var easyimg = require('easyimage');
var Chance = require('chance'),
  chance = new Chance();
var geohash = require('latlon-geohash');
var geolib = require('geolib');
var validator = require('validator');

// make sure data directory exists
var dataDir = '/public/data';
var fullDir = appRoot + dataDir;
fs.existsSync(fullDir) || fs.mkdirSync(fullDir);

var Content = require('../models/Content.js');

exports.get_content = function (req, res) {
  Content.find().sort({
    date: -1
  }).exec(function (err, contents) {
    res.json(contents);
  });
};

exports.get_content_by_id = function (req, res) {
  Content.findById(req.params.id, function (err, content) {
    if (err)
      res.send(err);
    res.json(content);
  });
};

exports.post_image_content = function (req, res, io) {

  function getSize(f, cb) {
    var stats = fs.statSync('/data/' + now + '/' + f.pic.name);
    var fileSizeInKilobytes = stats["size"] / 1000.0;
    console.log("xxxxxxxx: " + fileSizeInKilobytes);
    cb(fileSizeInKilobytes);
  };

  var form = new formidable.IncomingForm(),
    now = Date.now(),
    dir = fullDir + '/' + now;

  fs.mkdirSync(dir);

  form.parse(req, function (err, fields, files) {

    var path = dir + '/' + files.pic.name;
    var newPath = dir + '/' + files.pic.name;
    fs.renameSync(files.pic.path, newPath);

    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "thumbnail-" + files.pic.name,
      width: 300,
      height: 300,
      quality: 70,
    }).then(
      function (image) {
        easyimg.resize({
          src: newPath,
          dst: dir + '/' + "large-" + files.pic.name,
          width: 800,
          height: 800,
          quality: 80,
        }).then(
          function (image) {
            easyimg.resize({
              src: newPath,
              dst: dir + '/' + "small-" + files.pic.name,
              width: 450,
              height: 450,
              quality: 80,
            }).then(
              function (image) {
                getSize(files, function (fileSize) {
                  var content = new Content();
                  content.date = new Date();
                  content.public = fields.public;
                  content.image.size = fileSize;
                  content.image.url = '/data/' + now + '/' + files.pic.name;
                  content.image.thumb = '/data/' + now + '/' + "thumbnail-" + files.pic.name;
                  content.image.large = '/data/' + now + '/' + "large-" + files.pic.name;
                  content.image.small = '/data/' + now + '/' + "small-" + files.pic.name;
                  content.title = fields.title;
                  content.image.caption = fields.caption;
                  content.user = req.user.email;

                  content.save(function (err) {
                    console.log(content);
                    res.json({
                      result: 'content'
                    });
                  });

                });
              },
              function (err) {
                console.log("small: " + err);
              }
            )
          },
          function (err) {
            console.log("large: " + err);
          }
        );
      },
      function (err) {
        console.log("thumb: " + err);
      }
    );
  });
};

exports.post_text_content = function (req, res) {

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    var content = new Content();
    content.public = fields.public;
    content.date = new Date();
    content.text.body = fields.text;
    content.title = fields.title;
    content.text.author = fields.author;
    content.text.link = fields.link;
    content.user = req.user.email;

    content.save(function (err) {
      res.json({
        result: 'content'
      });
    });

  });


};

exports.delete_image_content = function (req, res) {
  Content.findById(req.params.id, function (err, content) {
    if (err) {
      res.send(err);
    }
    var p = content.image.url.split('/');
    console.log("datadir: " + fullDir + '/' + p[2]);
    rimraf(fullDir + '/' + p[2], function (err) {
      if (err)
        console.log(err);
    });
  });

  Content.remove({
    _id: req.params.id
  }, function (err, content) {
    if (err) {
      res.send(err);
    }
    res.json({
      message: 'Success'
    });
  });
};

exports.delete_text_content = function (req, res) {
  Content.remove({
    _id: req.params.id
  }, function (err, content) {
    if (err) {
      res.send(err);
    }
    res.json({
      message: 'Success'
    });
  });
};