var formidable = require('formidable');
var Container = require('../models/Container.js');
var Content = require('../models/Content.js');

exports.get = function (req, res) {

  Container.find().sort({
    start_date: -1
  }).exec(function (err, containers) {
    if (err)
      res.send(err);

    res.json(containers);
  });
};

exports.delete = function (req, res) {

  Container.remove({
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