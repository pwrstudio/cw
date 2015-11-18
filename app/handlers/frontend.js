/*
 *
 *  FRONTEND HANDLER
 *
 */

var geoip = require('geoip-lite'),
  geopoint = require('geopoint'),
  SolarCalc = require('solar-calc'),
  Container = require('../models/Container.js'),
  Content = require('../models/Content.js'),
  Collection = require('../models/Collection.js');
/*
 *
 *  Render index page
 *
 */

exports.index = function (req, res) {

  var serverGeo = geoip.lookup("85.214.100.3");

  if (serverGeo != undefined && serverGeo != null) {

    var lat = serverGeo.ll[0],
      long = serverGeo.ll[1],
      now = new Date(),
      night = false,
      solar = new SolarCalc(now, lat, long);

    if (now > solar.sunset) {
      night = true;
    } else if (now.getHours() > 0 && now.getHours() < solar.sunrise.getHours()) {
      night = true;
    }

    Container.find().sort({
      start_date: -1
    }).exec(function (err, data_container) {
      Content.find().sort({
        year: -1
      }).exec(function (err, data_content) {
        var query = Content.where({
          "image.frontpage": true
        });
        query.findOne().exec(function (err, frontpage) {

          if (frontpage != null && frontpage != "undefined") {
            var ctx = {
              night: night,
              frontpage: {
                full: frontpage.image.url,
                pinky: frontpage.image.pinky
              },
              container: data_container,
              content: data_content
            };
          } else {
            var ctx = {
              night: night,
              container: data_container,
              content: data_content
            };
          }

          res.render('index', ctx);

        });
      });
    });
  }
};


/*
 *
 *  Render backend area
 *
 */

exports.infra = function (req, res) {
  res.render('infra', {
    layout: "backend"
  });
};


/*
 *
 *  Render collection page
 *
 */

//exports.collection = function (req, res) {
//
//    // Find collection by slug
//    Collection.findOne({
//        slug: req.params.slug
//    }).exec(function (err, collection) {
//        var objects = [];
//
//        for (var i = 0; i < collection.content.length; i++) {
//            Content.findById(collection.content[i], function (err, item) {
//                objects.push(item);
//            });
//        }
//
//        var data = {
//            collection: collection,
//            objects: objects
//        }
//        res.render('collection', data);
//    });
//};


/*
 *
 *  Fallback 404
 *
 */

exports.fallback = function (req, res) {
  res.render('404', {});
};