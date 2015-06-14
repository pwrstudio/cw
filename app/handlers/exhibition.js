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
    exhibition.start_date = fields.start_date;
    exhibition.end_date = fields.end_date;

    exhibition.save(function (err) {
      if (err) {
        res.json(err);
      } else {
        res.json({result: "exhibition"});
      }
    });

  });

};

//exports.get_exhibition_image = function (req, res) {
//  Content.findById(req.params.id, function (err, image) {
//    if (err) {
//      res.send(err);
//    } else {
//      res.json(image.exhibitions);
//    }
//  });
//};