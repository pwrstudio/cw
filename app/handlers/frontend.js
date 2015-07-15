var requestIp = require('request-ip');
var traceroute = require('traceroute');
var geoip = require('geoip-lite');
var geolib = require('geolib');
var geopoint = require('geopoint');
var random = require("random-js")();

var Container = require('../models/Container.js');
var Content = require('../models/Content.js');

exports.index = function (req, res) {

  var clientIp = requestIp.getClientIp(req);

  clientIp = clientIp.replace("::ffff:", "");

  var clientGeo = geoip.lookup(clientIp);

  //	console.log(clientGeo);

  var lat = clientGeo.ll[0];
  var long = clientGeo.ll[1];

  var serverGeo = geoip.lookup("52.5.9.41");

  var serverLat = serverGeo.ll[0];
  var serverLong = serverGeo.ll[1];

  var server = new geopoint(serverLat, serverLong);
  var client = new geopoint(lat, long);

  var distance = Math.round(server.distanceTo(client, true));

  Container.find().sort({
    start_date: -1
  }).exec(function (err, data_container) {
    Content.find().exec(function (err, data_content) {

      var ctx = {
        distance: distance,
        container: data_container,
        content: data_content,
        helpers: {
          space: function () {
            var s = "";
            var i;
            for (i = 0; i < (distance / 500); i++) {
              //						if (random.bool(.1)) {
              //							s += '<a href="" class="image"><div class="space">*</div></a>';
              //						} else {
              s += '<div class="space">*</div>';
              //						}
            }
            return s;
            //          return "ajklsdn";
          }
        }
      };
      //			console.log(ctx);
      res.render('index', ctx);
    });
  });
};

exports.infra = function (req, res) {
  res.render('infra', {
    layout: "backend"
  });
};

exports.fallback = function (req, res) {
  res.render('404', {});
};