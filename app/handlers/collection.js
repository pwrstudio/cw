var formidable = require('formidable');
var Collection = require('../models/Collection.js');
var Content = require('../models/Content.js');

var pdf = require('phantomjs-pdf');
var slug = require('slug')

exports.get_collection = function (req, res) {

  Collection.find().sort({
    "date": -1
  }).exec(function (err, collections) {
    if (err)
      res.send(err);

    res.json(collections);
  });

};

exports.get_collection_by_id = function (req, res) {

  Collection.findById(req.params.id, function (err, collection) {
    if (err)
      res.send(err);
    res.json(collection);
  });

};

exports.get_collection_by_title = function (req, res) {

  Collection.findById(req.params.id, function (err, collection) {
    if (err)
      res.send(err);
    res.json(collection);
  });

};

exports.make_collection = function (req, res) {

  console.log(req.body);
  console.log(req.body.title);
  console.log(req.body.selected);

  var collection = new Collection();
  collection.title = req.body.title;
  collection.slug = slug(req.body.title);
  collection.content = req.body.selected;
  collection.private = false;
  collection.date = new Date();

  collection.save(function (err) {
    console.log(collection);
    res.json({
      result: 'collection'
    });
  });

};

exports.delete_collection = function (req, res) {

  Collection.remove({
    _id: req.params.id
  }, function (err, collection) {
    if (err) {
      res.send(err);
    }
    res.json({
      message: 'Success'
    });
  });

};