var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

var auth = require('./handlers/auth.js');
var content = require('./handlers/content.js');
var exhibition = require('./handlers/exhibition.js');
var publication = require('./handlers/publication.js');
var frontend = require('./handlers/frontend.js');
var container = require('./handlers/container.js');

module.exports = function (app, io) {

  // Authentication

  app.get('/signup', auth.signup_form);

  app.get('/login', auth.login_form);

  app.get('/logout', auth.isLoggedIn, auth.logout);

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/infra',
    failureRedirect: '/login'
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/signup' // redirect back to the signup page if there is an error
  }));

  app.get('/check_session', function (req, res) {
    if (req.isAuthenticated()) {
      res.send(req.user.email);
    } else {
      res.send("false");
    }
  });


  // API: Content
  app.get('/api/content/get/:count', content.get_content);
  //
  app.get('/api/content/single/:id', content.get_content_by_id);

  app.post('/api/content/post/image', content.post_image_content);

  app.post('/api/content/update/image/:id', content.update_image_content);

  app.post('/api/content/update/text/:id', content.update_text_content);

  app.post('/api/content/post/text', content.post_text_content);

  app.delete('/api/content/del/image/:id', content.delete_image_content);

  app.delete('/api/content/del/text/:id', content.delete_text_content);


  // Container
  app.delete('/api/container/:id', container.delete);


  // API: Exhibition
  app.get('/api/exhibition', exhibition.get_exhibition);

  app.post('/api/exhibition', exhibition.post_exhibition);

  app.post('/api/update/exhibition/:id', exhibition.update_exhibition);


  // API: Publication
  app.get('/api/publication', publication.get_publication);

  app.post('/api/publication', publication.post_publication);

  app.post('/api/update/publication/:id', publication.update_publication);


  // frontend routes =========================================================

  app.get('/infra', auth.isLoggedIn, frontend.infra);

  app.get('/', frontend.index);

  app.get('*', frontend.fallback);
};