(function () {

  "use strict";

  /*
   *
   *  Collection handler
   *
   */

  var slug = require('slug'),
    Collection = require('../models/Collection.js');

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
      res.json(collections);
    });
  };


  /*
   *
   *  Get a collection  by id
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

    console.log(req.body);
    console.log(req.body.title);
    console.log(req.body.selected);

    collection.title = req.body.title;
    collection.slug = slug(req.body.title);
    collection.content = req.body.selected;
    collection.private = false;
    collection.date = new Date();

    collection.save(function (err) {
      console.log(collection);
      if (err) {
        res.send(err);
      }
      res.json({
        result: 'collection'
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