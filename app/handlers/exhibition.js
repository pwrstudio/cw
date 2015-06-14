var formidable = require('formidable');

var Exhibition = require('../models/Exhibition.js');
var Content = require('../models/Content.js');

exports.get_exhibition = function (req, res) {

  Exhibition.find().sort({
    title: 1
  }).exec(function (err, exhibitions) {
    if (err)
      res.send(err);

    res.json(exhibitions);
  });
};

exports.post_exhibition = function (req, res) {

  var form = new formidable.IncomingForm();

  form.on('field', function (field, value) {

    var exhibition = new Exhibition();
    exhibition.title = value;

    exhibition.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.json('{"success"}');
      }
    });

  });

  form.parse(req);

};

exports.get_exhibition_image = function (req, res) {
  Content.findById(req.params.id, function (err, image) {
    if (err) {
      res.send(err);
    } else {
      res.json(image.exhibitions);
    }
  });
};