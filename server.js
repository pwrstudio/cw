// Server modules =================================================
var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 80; // set our port
var server = app.listen(port);
var io = require('socket.io').listen(server);
console.log('Server running on ' + port); // shoutout to the user


// Server modules =================================================
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var exphbs = require('express3-handlebars');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var morgan = require('morgan');
var favicon = require('serve-favicon');

var requestIp = require('request-ip');
var traceroute = require('traceroute');
//var whois = require('node-whois')
var geoip = require('geoip-lite');
var geolib = require('geolib');
var geopoint = require('geopoint');

var hbs = require('express3-handlebars');

// configuration ===========================================

// config files
var db = require('./config/db');

require('./config/passport')(passport); // pass passport for configuration

global.appRoot = path.resolve(__dirname);

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

mongoose.connect(db.url); // connect to our mongoDB database 
//mongoose.set('debug', true);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));
app.use(bodyParser.urlencoded({
  extended: true
})); // parse application/x-www-form-urlencoded

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

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public', {
  maxAge: oneYear
})); // set the static files location /public/img will be /img for users
app.use(favicon(__dirname + '/public/favicon.ico'));


// routes ==================================================
require('./app/routes')(app, passport, io); // pass our application into our routes

//io.on('connection', function(socket){
//  socket.on('chat message', function(msg){
//    io.emit('chat message', msg);
//  });
//});

//io.on('connection', function(socket){
//  console.log(io);
//  console.log('a user connected');
//  socket.on('disconnect', function(){
//    console.log('user disconnected');
//  });
//});

//db.image.ensureIndex({ 'loc': '2dsphere' });

// start app ===============================================
exports = module.exports = app; // expose app