var formidable = require('formidable');
var Container = require('../models/Container.js');
var Content = require('../models/Content.js');

exports.get_exhibition = function (req, res) {

  Container.find().sort({
    start_date: -1
  }).exec(function (err, exhibitions) {
    if (err)
      res.send(err);

    res.json(exhibitions);
  });
};

exports.post_exhibition = function (req, res) {

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    console.log(fields);

    var exhibition = new Container();
    exhibition.title = fields.title;
    exhibition.location = fields.location;
    exhibition.link = fields.link;
    exhibition.start_date = fields.start_date;
    exhibition.end_date = fields.end_date;
    exhibition.start_date_pretty = fields.start_date;
    exhibition.end_date_pretty = fields.end_date;

    exhibition.save(function (err) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          result: "exhibition"
        });
      }
    });

  });

};

exports.update_exhibition = function (req, res) {

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    Container.findById(req.params.id, function (err, exhibition) {
      if (err) {
        res.send(err);
      }

      console.log(fields);

      exhibition.title = fields.title;
      exhibition.location = fields.location;
      exhibition.link = fields.link;
      exhibition.start_date = fields.start_date;
      exhibition.end_date = fields.end_date;
      exhibition.start_date_pretty = fields.start_date;
      exhibition.end_date_pretty = fields.end_date;

      exhibition.save(function (err) {
        if (err) {
          res.json(err);
        } else {
          res.json({
            result: "exhibition"
          });
        }
      });

    });

  });

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