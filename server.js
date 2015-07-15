// Server modules =================================================
var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  port = process.env.PORT || 80,
  server = app.listen(port),
  io = require('socket.io').listen(server);

console.log('Server running on ' + port); // shoutout to the user


// Server modules =================================================
var mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  path = require('path'),
  exphbs = require('express3-handlebars'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  morgan = require('morgan'),
  favicon = require('serve-favicon');

var requestIp = require('request-ip');
var traceroute = require('traceroute');
var whois = require('whois-ux');
var geoip = require('geoip-lite');
var geolib = require('geolib');
var geopoint = require('geopoint');
var iso3311a2 = require('iso-3166-1-alpha-2');
var Geohash = require('latlon-geohash');

var hbs = require('express3-handlebars');

var mtr = require('./app/helpers/mtr.js');


// configuration ===========================================

// config files
var db = require('./config/db');

require('./config/passport')(passport);

global.appRoot = path.resolve(__dirname);

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

mongoose.connect(db.url);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

var oneYear = 31557600000;

app.use(session({
  secret: 'ilovescotchscotchyscotchscotch',
  cookie: {
    maxAge: 2629743830
  },
  store: require('mongoose-session')(mongoose)
})); // session secret
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public', {
  maxAge: oneYear
}));
app.use(favicon(__dirname + '/public/favicon.ico'));


// routes ==================================================
require('./app/routes')(app, passport, io); // pass our application into our routes

// SOCKET
io.on('connection', function (socket) {

  //  console.log("New connection on " + socket.id);

  var ip = socket.handshake.address;
  ip = ip.replace("::ffff:", "");
  var id = socket.id;

  function getGeo(i, callback) {
    var clientGeo = geoip.lookup(i);
    if (clientGeo !== null) {
      callback(clientGeo);
    }
  }

  mtr.trace_raw(ip, {}, function (data, d) {

    if (d[0] == 'h') {

      getGeo(d[2], function (geo) {

        if (geo !== undefined && geo !== null) {

          var lat = geolib.decimal2sexagesimal(geo.ll[0]);
          var long = geolib.decimal2sexagesimal(geo.ll[1]);

          var geohash = Geohash.encode(geo.ll[0], geo.ll[1]);

          var find = 'NaN';
          var re = new RegExp(find, 'g');

          lat = lat.replace(re, "0");
          long = long.replace(re, "0");


          whois.whois(d[2], function (err, data) {
            var point = {
              ip: d[2],
              country: iso3311a2.getCountry(geo.country),
              city: geo.city,
              latitude: lat,
              longitude: long,
              geohash: geohash,
              orgname: data.OrgName,
              orgid: data.OrgId,
              netname: data.netname
            };

            if (io.sockets.connected[id]) {
              io.sockets.connected[id].emit('traced', point);
            }
          });

        }

      });

    }

  });


  //  socket.on('disconnect', function () {
  //    socket.broadcast.emit("left", {
  //      id: socket.id
  //    });
  //    console.log('user disconnected');
  //  });

});


//db.image.ensureIndex({ 'loc': '2dsphere' });

// start app ===============================================
exports = module.exports = app; // expose app