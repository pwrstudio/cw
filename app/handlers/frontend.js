/*
 *
 *  FRONTEND HANDLER
 *
 */

(function () {

  "use strict";

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

    var serverGeo = geoip.lookup("85.214.100.3"),
      now = new Date(),
      night = false,
      solar,
      lat,
      long;

    if (serverGeo) {

      lat = serverGeo.ll[0];
      long = serverGeo.ll[1];
      now = new Date();
      night = false;
      solar = new SolarCalc(now, lat, long);

      if (now > solar.sunset) {
        night = true;
      } else if (now.getHours() >= 0 && now.getHours() <= solar.sunrise.getHours()) {
        night = true;
      }

      Container.find().sort({
        start_date: -1
      }).exec(function (err, data_container) {
        Content.find().sort({
          index: 1
        }).exec(function (err, data_content) {

          var query = Content.where({
            "image.frontpage": true
          });

          query.findOne().exec(function (err, frontpage) {

            var ctx;

            if (frontpage) {
              ctx = {
                night: night,
                frontpage: {
                  full: frontpage.image.url,
                  pinky: frontpage.image.pinky
                },
                container: data_container,
                content: data_content
              };
            } else {
              ctx = {
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
   *  Fallback 404
   *
   */

  exports.fallback = function (req, res) {
    res.render('404', {});
  };

}());