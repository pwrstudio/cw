/*
 *
 *  Sockets
 *
 */

var whois = require('whois-ux'),
  geoip = require('geoip-lite'),
  geolib = require('geolib'),
  iso3311a2 = require('iso-3166-1-alpha-2'),
  Geohash = require('latlon-geohash'),
  mtr = require('../helpers/mtr.js'),
  ping = require("net-ping");

var Cables = require('../models/Cables.js');


module.exports = function (app, io) {


  io.on('connection', function (socket) {

    // Get IP and convert to v.4
    var ip = socket.handshake.address;
    ip = ip.replace("::ffff:", "");
    var id = socket.id;

    // Look up location of ip
    function getGeo(i, callback) {
      var clientGeo = geoip.lookup(i);
      if (clientGeo !== null) {
        callback(clientGeo);
      }
    }

    // Trace the route from server to client
    mtr.trace_raw(ip, {}, function (data, d) {

      if (d[0] == 'h') {


        getGeo(d[2], function (geo) {

          if (geo !== undefined && geo !== null) {

            var lat = geolib.decimal2sexagesimal(geo.ll[0]);
            var long = geolib.decimal2sexagesimal(geo.ll[1]);

            // Generate geohash
            var geohash = Geohash.encode(geo.ll[0], geo.ll[1]);

            var find = 'NaN';
            var re = new RegExp(find, 'g');

            lat = lat.replace(re, "0");
            long = long.replace(re, "0");

            whois.whois(d[2], function (err, data) {

              // Find nearby cable landing sites
              var close = [];

              Cables.search({
                loc: [geo.ll[1], geo.ll[0]],
                distance: 100
              }, function (err, items) {
                if (err) {
                  console.log(err);
                }
                var arrayLength = items.length;
                for (var i = 1; i < arrayLength && i < 6; i++) {
                  var newObject = {
                    name: items[i].name,
                    url: items[i].url,
                    owners: items[i].owners
                  };
                  close.push(newObject);
                }

                var point = {
                  ip: d[2],
                  index: d[1],
                  country: iso3311a2.getCountry(geo.country),
                  city: geo.city,
                  latitude: lat,
                  longitude: long,
                  geohash: geohash,
                  orgname: data.OrgName,
                  orgid: data.OrgId,
                  netname: data.netname,
                  cables: close
                };

                if (io.sockets.connected[id]) {
                  //                  console.log("host sent: " + id);
                  io.sockets.connected[id].emit('traced', point);
                }
              });
            });

          }

        });

      }

      if (d[0] == 'p') {

        var point = {
          latency: d[2],
          index: d[1],
        };

        if (io.sockets.connected[id]) {
          io.sockets.connected[id].emit('traced', point);
        }

      }

      if (d[0] == 'x') {

//        var ms = 74;
//        
//        var session = ping.createSession();
//
//        session.pingHost(ip, function (error, target, sent, rcvd) {
//          var ms = rcvd - sent;
//          if (error)
//            console.log(target + ": " + error.toString());
//          else
//            console.log(target + ": Alive (ms=" + ms + ")");
//          if (io.sockets.connected[id]) {
//            var point = {
//              roundtrip: ms
//            };
//            io.sockets.connected[id].emit('tracedone', point);
//          }
//        });

      }

    });

  });

}