/*
 *
 *  FRONTEND HANDLER
 *
 */


var requestIp = require('request-ip'),
  geoip = require('geoip-lite'),
  geopoint = require('geopoint'),
  Container = require('../models/Container.js'),
  Content = require('../models/Content.js'),
  Collection = require('../models/Collection.js');

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

      Container.find().sort({
        start_date: -1
      }).exec(function (err, data_container) {
        Content.find().sort({
          year: -1
        }).exec(function (err, data_content) {
          var ctx = {
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
          res.render('index', ctx);
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