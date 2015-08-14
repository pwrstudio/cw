  /*
   *
   *  Authentication
   *
   */

  var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


  /*
   *
   *  Signup form
   *
   */

  exports.signup_form = function (req, res) {
    res.render('signup', {
      layout: "backend"
    });
  };


  /*
   *
   *  Login form
   *
   */

  exports.login_form = function (req, res) {
    res.render('login', {
      layout: "backend"
    });
  };


  /*
   *
   *  Logout
   *
   */

  exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
  };


  /*
   *
   *  Check if logged in, else redirect
   *
   */

  exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };