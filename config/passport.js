// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/User');

// expose this function to our app using module.exports
module.exports = function (passport) {

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {

      process.nextTick(function () {

        User.findOne({
          'email': email
        }, function (err, user) {
          if (err)
            return done(err);

          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {

            var newUser = new User();

            newUser.email = email;
            newUser.password = newUser.generateHash(password);

            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }

        });

      });

    }));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) { // callback with email and password from our form

      User.findOne({
        'email': email
      }, function (err, user) {
        if (err)
          return done(err);

        if (!user)
          return done(null, false);

        if (!user.validPassword(password))
          return done(null, false);

        return done(null, user);
      });

    }));

};