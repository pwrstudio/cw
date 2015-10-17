/*
 *
 *  Sockets
 *
 */

var whois = require('whois-ux'),
    geoip = require('geoip-lite'),
    geolib = require('geolib'),
    geopoint = require('geopoint'),
    iso3311a2 = require('iso-3166-1-alpha-2'),
    Geohash = require('latlon-geohash'),
    mtr = require('../helpers/mtr.js'),
    ping = require("net-ping");

var Cables = require('../models/Cables.js');

var prevGeo, prevPoint, thisPoint;
var totalDistance = 0;

// Look up location of ip
function getGeo(i, callback) {
    var clientGeo = geoip.lookup(i);
    if (clientGeo !== null) {
        callback(clientGeo);
    }
}

module.exports = function (app, io) {

    io.on('connection', function (socket) {

        // Get IP and convert to v.4
        //    var ip = socket.handshake.header['x-real-ip'];
        var ip = socket.handshake.headers["x-real-ip"];
        ip = ip.replace("::ffff:", "");
        var id = socket.id;

        console.log(ip);

        // Get clients location
        prevGeo = geoip.lookup(ip);
        prevPoint = new geopoint(prevGeo.ll[0], prevGeo.ll[1]),

            // Trace the route from server to client
            mtr.trace_raw(ip, {}, function (data, d) {

                if (d[0] == 'h') {


                    getGeo(d[2], function (geo) {

                        if (geo !== undefined && geo !== null) {

                            var lat = geolib.decimal2sexagesimal(geo.ll[0]);
                            var long = geolib.decimal2sexagesimal(geo.ll[1]);

                            var thisPoint = new geopoint(geo.ll[0], geo.ll[1]);

                            var distance = prevPoint.distanceTo(thisPoint, true);

                            totalDistance = totalDistance + distance;

                            console.log("distance: " + distance);
                            console.log("total: " + totalDistance);

                            prevPoint = thisPoint;

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
                                        cables: close,
                                        distance: Math.round(distance)
                                    };

                                    if (io.sockets.connected[id]) {
                                        io.sockets.connected[id].emit('traced', point);
                                    }
                                });
                            });

                        }

                    });

                }

                // End of traceroute
                if (d[0] == 'x') {
                    if (io.sockets.connected[id]) {
                        var point = {
                            total: Math.round(totalDistance)
                        };
                        io.sockets.connected[id].emit('tracedone', point);
                    }
                }

            });

    });

}