var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

exports.signup_form = function (req, res) {
  res.render('signup', {});
};

exports.login_form = function (req, res) {
  res.render('login', {});
};

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};

exports.isLoggedIn = function (req, res, next) {
  
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
