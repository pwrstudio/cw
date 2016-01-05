/*
 *
 *  Set up Express, start server, start socket.io...
 *
 */

/*
 *
 *  PRODUCTION MODE
 *
 */

process.env.NODE_ENV = 'production';

var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  port = process.env.PORT || 8080,
  server = app.listen(port),
  io = require('socket.io').listen(server),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  path = require('path'),
  exphbs = require('express-handlebars'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  db = require('./config/db');

require('./config/passport')(passport);

global.appRoot = path.resolve(__dirname);

/*
 *
 *  Set up handlebars
 *
 */

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');


/*
 *
 *  Connect MongoDB
 *
 */

mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));

app.use(bodyParser.urlencoded({
  extended: true
}));


/*
 *
 *  Session etc...
 *
 */

app.use(cookieParser());

app.use(session({
  secret: 'ilovescotchscotchyscotchscotch',
  cookie: {
    maxAge: 2629743830
  },
  store: require('mongoose-session')(mongoose)
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('X-HTTP-Method-Override'));


/*
 *
 *  Set up static directory
 *
 */

app.use(express.static(__dirname + '/public', {
  maxAge: 31557600000
}));


/*
 *
 *  Routes
 *
 */

require('./app/routes')(app);

/*
 *
 *  Sockets
 *
 */

require('./app/handlers/socket.js')(app, io);


/*
 *
 *  Start app
 *
 */

exports = module.exports = app;

// For now...

//process.on('uncaughtException', function (err) {
//  console.log('Caught exception: ' + err);
//});