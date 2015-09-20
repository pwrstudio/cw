/*
 *
 *  FRONTEND HANDLER
 *
 */


var requestIp = require('request-ip'),
  geoip = require('geoip-lite'),
  geopoint = require('geopoint'),
  SolarCalc = require('solar-calc'),
  Container = require('../models/Container.js'),
  Content = require('../models/Content.js'),
  Collection = require('../models/Collection.js'),
  Meta = require('../models/Meta.js');

/*
 *
 *  Render index page
 *
 */

exports.index = function (req, res) {

  var clientIp = requestIp.getClientIp(req).replace("::ffff:", "");

  var clientGeo = geoip.lookup(clientIp);

  if (clientGeo != undefined && clientGeo != null) {

    var lat = clientGeo.ll[0],
      long = clientGeo.ll[1];

    var serverGeo = geoip.lookup("52.5.9.41");

    if (serverGeo != undefined && serverGeo != null) {

      var serverLat = serverGeo.ll[0],
        serverLong = serverGeo.ll[1];

      var server = new geopoint(serverLat, serverLong),
        client = new geopoint(lat, long);

      var distance = Math.round(server.distanceTo(client, true));

      var now = new Date(),
        night = false;

      var solar = new SolarCalc(now, lat, long);

      if (now > solar.sunset) {
        night = true;
      }
      Container.find().sort({
        start_date: -1
      }).exec(function (err, data_container) {
        Content.find().sort({
          year: -1
        }).exec(function (err, data_content) {
          Meta.findOne().exec(function (err, data_meta) {

            var ctx = {
              night: night,
              meta: data_meta,
              container: data_container,
              content: data_content,
              helpers: {
                space: function () {
                  var s = "";
                  var i;
                  for (i = 0; i < (distance / 500); i++) {
                    s += '<div class="space">*</div>';
                  }
                  return s;
                }
              }
            };

            res.render('index', ctx);

          });
        });
      });
    }
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

exports.collection = function (req, res) {

  // Find collection by slug
  Collection.findOne({
    slug: req.params.slug
  }).exec(function (err, collection) {
    var objects = [];

    for (var i = 0; i < collection.content.length; i++) {
      Content.findById(collection.content[i], function (err, item) {
        objects.push(item);
      });
    }

    var data = {
      collection: collection,
      objects: objects
    }
    res.render('collection', data);
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


//

exports.intro1 = function (req, res) {

  var clientIp = requestIp.getClientIp(req).replace("::ffff:", "");

  var clientGeo = geoip.lookup(clientIp);

  if (clientGeo != undefined && clientGeo != null) {

    var lat = clientGeo.ll[0],
      long = clientGeo.ll[1];

    var serverGeo = geoip.lookup("52.5.9.41");

    if (serverGeo != undefined && serverGeo != null) {

      var serverLat = serverGeo.ll[0],
        serverLong = serverGeo.ll[1];

      var server = new geopoint(serverLat, serverLong),
        client = new geopoint(lat, long);

      var distance = Math.round(server.distanceTo(client, true));

      var now = new Date(),
        night = false;

      var solar = new SolarCalc(now, lat, long);

      console.log(now.getHours());
      console.log(solar.sunset);
      console.log(solar.sunrise);

      if (now > solar.sunset) {
        night = true;
      }

      console.log(night);

      Container.find().sort({
        start_date: -1
      }).exec(function (err, data_container) {
        Content.find().sort({
          year: -1
        }).exec(function (err, data_content) {
          Meta.findOne().exec(function (err, data_meta) {

            var ctx = {
              night: night,
              meta: data_meta,
              distance: distance,
              container: data_container,
              content: data_content,
              helpers: {
                space: function () {
                  var s = "";
                  var i;
                  for (i = 0; i < (distance / 500); i++) {
                    s += '<div class="space">*</div>';
                  }
                  return s;
                }
              }
            };

            res.render('index1', ctx);

          });
        });
      });
    }
  }
};

exports.intro2 = function (req, res) {

  var clientIp = requestIp.getClientIp(req).replace("::ffff:", "");

  var clientGeo = geoip.lookup(clientIp);

  if (clientGeo != undefined && clientGeo != null) {

    var lat = clientGeo.ll[0],
      long = clientGeo.ll[1];

    var serverGeo = geoip.lookup("52.5.9.41");

    if (serverGeo != undefined && serverGeo != null) {

      var serverLat = serverGeo.ll[0],
        serverLong = serverGeo.ll[1];

      var server = new geopoint(serverLat, serverLong),
        client = new geopoint(lat, long);

      var distance = Math.round(server.distanceTo(client, true));

      var now = new Date(),
        night = false;

      var solar = new SolarCalc(now, lat, long);

      console.log(now.getHours());
      console.log(solar.sunset);
      console.log(solar.sunrise);

      if (now > solar.sunset) {
        night = true;
      }

      console.log(night);

      Container.find().sort({
        start_date: -1
      }).exec(function (err, data_container) {
        Content.find().sort({
          year: -1
        }).exec(function (err, data_content) {
          Meta.findOne().exec(function (err, data_meta) {

            var ctx = {
              night: night,
              meta: data_meta,
              distance: distance,
              container: data_container,
              content: data_content,
              helpers: {
                space: function () {
                  var s = "";
                  var i;
                  for (i = 0; i < (distance / 500); i++) {
                    s += '<div class="space">*</div>';
                  }
                  return s;
                }
              }
            };

            res.render('index2', ctx);

          });
        });
      });
    }
  }
};