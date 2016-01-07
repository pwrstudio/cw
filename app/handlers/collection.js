(function () {

  "use strict";

  /*
   *
   *  Collection handler
   *
   */

  var slug = require('slug'),
    Collection = require('../models/Collection.js'),
    Content = require('../models/Content.js'),
    async = require('async');


  /*
   *
   *  Get all collections
   *
   */

  exports.get_collection = function (req, res) {
    Collection.find().sort({
      "date": -1
    }).exec(function (err, collections) {
      if (err) {
        res.send(err);
      }

      console.log(collections);

      res.json(collections);

    });

  };


  /*
   *
   *  Get a collection by id
   *
   */

  exports.get_collection_by_id = function (req, res) {

    Collection.findById(req.params.id, function (err, collection) {
      if (err) {
        res.send(err);
      }
      res.json(collection);
    });

  };


  /*
   *
   *  Add collection
   *
   */

  exports.make_collection = function (req, res) {

    var collection = new Collection();

    console.log(req.body.selected);

    collection.title = req.body.title;
    collection.slug = slug(req.body.title);
    collection.private = false;
    collection.date = new Date();

    var objects = [];

    async.each(req.body.selected, function (contentItem, callback) {

      console.log(contentItem);

      Content.findById(contentItem, function (err, item) {
        console.log(item);
        objects.push(item);
        callback(err);
      });

    }, function (err) {

      if (err) {
        return next(err);
      }

      console.log(objects);

      collection.content = objects;

      collection.save(function (err) {
        console.log(collection);
        if (err) {
          res.send(err);
        }
        res.json({
          result: 'collection'
        });
      });

    });

  };


  /*
   *
   *  Delete collection
   *
   */

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

}());