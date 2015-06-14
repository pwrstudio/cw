var requestIp = require('request-ip');
var traceroute = require('traceroute');
var geoip = require('geoip-lite');
var geolib = require('geolib');
var geopoint = require('geopoint');

var Container = require('../models/Container.js');
var Content = require('../models/Content.js');

exports.index = function (req, res) {

  var clientIp = requestIp.getClientIp(req);

  clientIp = clientIp.replace("::ffff:", "");

  //  console.log(clientIp);

  var clientGeo = geoip.lookup(clientIp);

  //  console.log(clientGeo);

  var lat = clientGeo.ll[0];
  var long = clientGeo.ll[1];

  var serverGeo = geoip.lookup("52.5.9.41");

  var serverLat = serverGeo.ll[0];
  var serverLong = serverGeo.ll[1];

  //  console.log(serverGeo);

  var server = new geopoint(serverLat, serverLong);
  var client = new geopoint(lat, long);

  var distance = Math.round(server.distanceTo(client, true));

  var space = "";

  for (i = 0; i < (distance / 300); i++) {
    space += '<div class="space">*</div>';
  }

  Container.find().sort({
    title: 1
  }).exec(function (err, data) {
    var data = {
      distance: distance,
      space: space,
      container: data
    };
    //    console.log(data);
    res.render('index', data);
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