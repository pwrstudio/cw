var Content = require('../models/Content.js');
var requestIp = require('request-ip');
var traceroute = require('traceroute');
//var whois = require('node-whois')
var geoip = require('geoip-lite');
var geolib = require('geolib');
var geopoint = require('geopoint');

var Exhibition = require('../models/Exhibition.js');
var Content = require('../models/Content.js');



exports.single = function (req, res) {
  var close = [];
  Content.findById(req.params.id, function (err, content) {
    Content.search({
      loc: [content.loc[0], content.loc[1]],
      distance: 50000
    }, function (err, items) {
      var arrayLength = items.length;
      for (var i = 1; i < arrayLength && i < 6; i++) {
        var newObject = {
          id: items[i]._id,
          thumb: items[i].thumb,
          small: items[i].small,
          large: items[i].large,
          body: items[i].body
        };
        close.push(newObject);
      }
      res.render('single', {
        url: content.url,
        id: content._id,
        body: content.body,
        v: content.__v,
        user: content.user,
        tags: content.tags,
        date: content.date,
        latitude: content.loc[0],
        longitude: content.loc[1],
        geohash: content.geohash,
        close: close
      });
    });
  });
}

exports.index = function (req, res) {

  var clientIp = requestIp.getClientIp(req);
  var clientGeo = geoip.lookup(clientIp);

  var lat = clientGeo.ll[0];
  var long = clientGeo.ll[1];

  //  console.log(clientGeo);

  var server = new geopoint(64.132443, -21.852442);
  var client = new geopoint(lat, long);

  var distance = Math.round(server.distanceTo(client, true));

  var space = "";

  for (i = 0; i < (distance / 300); i++) {
    space += '<div class="space">*</div>';
  }

  //    console.log(space);
  
  Exhibition.find().sort({
    title: 1
  }).exec(function (err, exhibitions) {
    console.log(exhibitions);
  });
  
  var exhibition = "";

var data = {
  distance: distance,
  space: space,
  exhibition: exhibition
};

res.render('index', data);
};

exports.infra = function (req, res) {
  res.render('infra', {});
};