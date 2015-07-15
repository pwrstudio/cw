var formidable = require('formidable'),
  fs = require('fs'),
  rimraf = require('rimraf'),
  randtoken = require('rand-token'),
  easyimg = require('easyimage'),
  Chance = require('chance'),
  chance = new Chance(),
  geohash = require('latlon-geohash'),
  geolib = require('geolib'),
  validator = require('validator');

// make sure data directory exists
var dataDir = '/public/data',
  fullDir = appRoot + dataDir;

fs.existsSync(fullDir) || fs.mkdirSync(fullDir);

var Content = require('../models/Content.js');

// Internal 

function resizeContent(newPath, dir, fileName) {

  easyimg.resize({
    src: newPath,
    dst: dir + '/' + "thumbnail-" + fileName,
    width: 300,
    height: 300,
    quality: 70,
  }).then(
    function (image) {
      console.log(image);
    },
    function (err) {
      console.log("large: " + err);
    }
  );

  easyimg.resize({
    src: newPath,
    dst: dir + '/' + "large-" + fileName,
    width: 800,
    height: 800,
    quality: 80,
  }).then(
    function (image) {
      console.log(image);
    },
    function (err) {
      console.log("large: " + err);
    }
  );

  easyimg.resize({
    src: newPath,
    dst: dir + '/' + "small-" + fileName,
    width: 450,
    height: 450,
    quality: 80,
  }).then(
    function (image) {
      console.log(image);
    },
    function (err) {
      console.log("thumb: " + err);
    }
  );
}

exports.post_image_content = function (req, res, io) {

  var form = new formidable.IncomingForm(),
    now = Date.now(),
    dir = fullDir + '/' + now;

  fs.mkdirSync(dir);

  form.parse(req, function (err, fields, files) {

    console.log(files);

    var fullFilePath = '/data/' + now + '/' + files.pic.name;

    var newPath = dir + '/' + files.pic.name;

    fs.renameSync(files.pic.path, newPath);

    resizeContent(newPath, dir, files.pic.name);

    var stats = fs.statSync(newPath);
    var fileSizeInKilobytes = stats.size / 1000.0;

    console.log("year: " + fields.year);
    console.log("///////////: " + fields);

    var content = new Content();
    content.date = new Date();
    content.year = fields.year;
    content.public = fields.public;
    content.image.size = fileSizeInKilobytes;
    content.image.url = fullFilePath;
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
};

exports.update_image_content = function (req, res) {

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    Content.findById(req.params.id, function (err, content) {
      if (err) {
        res.send(err);
      }

      console.log(fields);

      content.year = fields.year;
      content.public = fields.public;
      content.title = fields.title;
      content.image.caption = fields.caption;

      content.save(function (err) {
        console.log(content);
        res.json({
          result: 'content'
        });
      });
    });

  });
};

exports.post_text_content = function (req, res) {

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    var content = new Content();
    content.public = fields.public;
    content.date = new Date();
    content.year = fields.year;
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

exports.update_text_content = function (req, res) {

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {


    Content.findById(req.params.id, function (err, content) {
      if (err) {
        res.send(err);
      }

      console.log(fields);

      content.public = fields.public;
      content.year = fields.year;
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

exports.get_content = function (req, res) {
  console.log("asasdfasdfasfd");
  Content.find().sort({
    date: -1
  }).exec(function (err, contents) {
    console.log("asd");
    console.log(contents);
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