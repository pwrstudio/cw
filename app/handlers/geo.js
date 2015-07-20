var requestIp = require('request-ip');
var traceroute = require('traceroute');
var geoip = require('geoip-lite');
var geolib = require('geolib');
var geopoint = require('geopoint');
var Geohash = require('latlon-geohash');
var _ = require('underscore');

var Container = require('../models/Container.js');
var Content = require('../models/Content.js');
var Cables = require('../models/Cables.js');

exports.get_cables = function (req, res) {


  //  Cables.find({}, function (err, cable) {
  //      var counter = cable.length;
  //
  //      for (i = 0; i < counter; i++) {
  //        console.log(typeof cable[i].description);
  //        cable[i].description.forEach(function (entry) {
  //
  //          console.log(entry.coordinates);
  //
  //          entry.loc.type = "Point";
  //
  //        });
  //
  //        cable[i].save(function (err) {
  //          console.log(cable[i]);
  //          res.json({
  //            result: 'content'
  //          });
  //        });
  //
  //      }

  Cables.find().sort({
    name: 1
  }).exec(function (err, data) {
    var ctx = {
      cables: data
    };
    res.render('cables', ctx);
  });
  //    });

};

//
//db.cables.find( { "description.loc" :
//                         { $near :
//                           { $geometry :
//                              { type : "Point" ,
//                                coordinates : [ -38.542968, -3.718836 ] } ,
//                             $maxDistance : 100000
//                      } } } )