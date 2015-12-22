/*jslint browser: true, devel: true, node: true, nomen: true, plusplus: true*/

/*
 *
 *  Sockets
 *
 */

(function () {

  "use strict";

  var whois = require('whois-ux'),
    geoip = require('geoip-lite'),
    geopoint = require('geopoint'),
    iso3311a2 = require('iso-3166-1-alpha-2'),
    Geohash = require('latlon-geohash'),
    mtr = require('../helpers/mtr.js'),
    Cables = require('../models/Cables.js'),
    ping = require("net-ping"),
    prevGeo,
    prevPoint,
    thisPoint,
    totalDistance = 0;

  // Look up location of ip
  function getGeo(i, callback) {
    var clientGeo = geoip.lookup(i);
    if (clientGeo) {
      callback(clientGeo);
    }
  }

  module.exports = function (app, io) {

    io.on('connection', function (socket) {

      var ip = socket.handshake.headers["x-real-ip"],
        id = socket.id;

      if (!ip) {
        ip = socket.handshake.address;
        if (!ip) {
          ip = "93.98.67.0";
        }
      }

      ip = ip.replace("::ffff:", "");

      // Trace the route from server to client
      mtr.trace_raw(ip, {}, function (data, d) {

        var geohash,
          thisPoint,
          distance,
          session = ping.createSession();


        if (d[0] === 'h') {

          getGeo(d[2], function (geo) {

            if (geo) {

              // Generate geohash
              geohash = Geohash.encode(geo.ll[0], geo.ll[1]);
              thisPoint = new geopoint(geo.ll[0], geo.ll[1]);

              // Get current point    
              if (prevPoint) {
                // Calculate distance between previous point and current point
                distance = prevPoint.distanceTo(thisPoint, true);

                console.log(prevPoint._degLat + "/" + prevPoint._degLon + " to " + thisPoint._degLat + "/" + thisPoint._degLon + " == " + distance);

                // Update total distance
                totalDistance = totalDistance + distance;

                console.log("TOTAL:" + totalDistance);

              }

              // Make current point the new previous point
              prevPoint = thisPoint;

              whois.whois(d[2], function (err, data) {

                var i,
                  close = [];

                // Find nearby cable landing sites
                Cables.search({
                  loc: [geo.ll[1], geo.ll[0]],
                  distance: 100
                }, function (err, items) {

                  var point = {},
                    newObject = {};

                  if (items) {

                    for (i = 1; i < items.length && i < 6; i += i) {
                      newObject = {
                        name: items[i].name,
                        url: items[i].url,
                        owners: items[i].owners
                      };
                      close.push(newObject);
                    }

                  }

                  // Collect the data
                  point = {
                    ip: d[2],
                    index: d[1],
                    country: iso3311a2.getCountry(geo.country),
                    city: geo.city,
                    geohash: geohash,
                    orgname: data.OrgName,
                    orgid: data.OrgId,
                    netname: data.netname,
                    cables: close
                  };

                  // Return the data
                  if (io.sockets.connected[id]) {
                    io.sockets.connected[id].emit('traced', point);
                  }

                });
              });

            }

          });

        }

        // End of traceroute
        if (d[0] === 'x') {
          if (io.sockets.connected[id]) {

            session.pingHost(ip, function (error, target, sent, rcvd) {

              var point,
                roundtrip = rcvd - sent;

              if (error) {
                point = {
                  total: Math.round(totalDistance)
                };
              } else {
                console.log(roundtrip);
                point = {
                  total: Math.round(totalDistance),
                  roundtrip: roundtrip
                };
              }

              // Reset distance
              totalDistance = 0;
              prevPoint = null;
              io.sockets.connected[id].emit('tracedone', point);

            });

          }
        }

      });

    });

  };

}());