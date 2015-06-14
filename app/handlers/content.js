var formidable = require('formidable');
var fs = require('fs');
var rimraf = require('rimraf');
var randtoken = require('rand-token');
var easyimg = require('easyimage');
var Chance = require('chance'),
  chance = new Chance();
var geohash = require('latlon-geohash');
var geolib = require('geolib');

// make sure data directory exists
var dataDir = '/public/data';
var fullDir = appRoot + dataDir;
fs.existsSync(fullDir) || fs.mkdirSync(fullDir);

var Content = require('../models/Content.js');

exports.get_content = function (req, res) {
  Content.find().sort({
    date: -1
  }).exec(function (err, contents) {
    if (err)
      res.send(err);

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
  var form = new formidable.IncomingForm(),
    now = Date.now(),
    dir = fullDir + '/' + now;
  fs.mkdirSync(dir);

  form.on('file', function (field, file) {
    var path = dir + '/' + file.name;
    //    console.log(file.name);
    var rand = randtoken.generate(32);
    var newPath = dir + '/' + rand + ".jpg";
    fs.renameSync(file.path, newPath);


    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "thumbnail-" + rand + ".jpg",
      width: 300,
      height: 300,
      quality: 70,
    }).then(
      function (image) {
        console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
      },
      function (err) {
        console.log(err);
      }
    );

    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "large-" + rand + ".jpg",
      width: 800,
      height: 800,
      quality: 80,
    }).then(
      function (image) {
        console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
      },
      function (err) {
        console.log(err);
      }
    );

    easyimg.resize({
      src: newPath,
      dst: dir + '/' + "small-" + rand + ".jpg",
      width: 450,
      height: 450,
      quality: 80,
    }).then(
      function (image) {
        console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
      },
      function (err) {
        console.log(err);
      }
    )

    var content = new Content();
    content.date = new Date();
    content.image.url = '/data/' + now + '/' + rand + ".jpg";
    content.image.thumb = '/data/' + now + '/' + "thumbnail-" + rand + ".jpg";
    content.image.large = '/data/' + now + '/' + "large-" + rand + ".jpg";
    content.image.small = '/data/' + now + '/' + "small-" + rand + ".jpg";
    content.user = req.user.email;

    console.log(content);

    content.save(function (err) {
      console.log("5");
      //      if (err) {
      //        res.send(err);
      //      }

      console.log("saved");
      res.json({
        message: 'Success'
      });

    });

  });

  form.parse(req);

};

exports.post_text_content = function (req, res) {

  var form = new formidable.IncomingForm();

  form.on('field', function (field, value) {

    var content = new Content();
    content.date = new Date();
    content.text.body = value;
    content.user = req.user.email;
    content.gen = 0;

    content.save(function (err) {
//      if (err) {
//        res.send(err);
//      }
      res.json({
        message: 'Success'
      });
    });

  });

  form.parse(req);

};

exports.delete_image_content = function (req, res) {
  Content.findById(req.params.id, function (err, content) {
    if (err) {
      res.send(err);
    }
    console.log(content.url);
    var p = content.url.split('/');
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
  Text.remove({
    _id: req.params.id
  }, function (err, text) {
    if (err) {
      res.send(err);
    }
    res.json({
      message: 'Success'
    });
  });
};