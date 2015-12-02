  /*
   *
   *  ROUTER
   *
   */

  var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    auth = require('./handlers/auth.js'),
    content = require('./handlers/content.js'),
    exhibition = require('./handlers/exhibition.js'),
    publication = require('./handlers/publication.js'),
    frontend = require('./handlers/frontend.js'),
    container = require('./handlers/container.js');

  module.exports = function (app) {

    /*
     *
     *  Authentication
     *
     */

    //    app.get('/signup', auth.signup_form);

    app.get('/login', auth.login_form);

    app.get('/logout', auth.isLoggedIn, auth.logout);

    app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/infra',
      failureRedirect: '/login'
    }));

    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/signup'
    }));

    app.get('/check_session', function (req, res) {
      if (req.isAuthenticated()) {
        res.send(req.user.email);
      } else {
        res.send("false");
      }
    });


    /*
     *
     *  API: Content
     *
     */

    app.get('/api/content/get/:count', content.get_content);
    app.get('/api/content/single/:id', content.get_content_by_id);

    app.post('/api/content/post/image', content.post_image_content);
    app.post('/api/content/update/image/:id', content.update_image_content);
    app.delete('/api/content/del/image/:id', content.delete_image_content);

    app.post('/api/content/post/audio', content.post_audio_content);
    app.post('/api/content/update/audio/:id', content.update_audio_content);
    app.delete('/api/content/del/audio/:id', content.delete_audio_content);

    app.post('/api/content/post/video', content.post_video_content);
    app.post('/api/content/update/video/:id', content.update_video_content);
    app.delete('/api/content/del/video/:id', content.delete_video_content);

    app.post('/api/content/updateorder/:id/:index', content.update_content_order);

    /*
     *
     *  API: Exhibition
     *
     */

    app.get('/api/exhibition', exhibition.get_exhibition);
    app.post('/api/exhibition', exhibition.post_exhibition);
    app.post('/api/update/exhibition/:id', exhibition.update_exhibition);

    /*
     *
     *  API: Publication
     *
     */

    app.get('/api/publication', publication.get_publication);

    app.post('/api/publication', publication.post_publication);
    app.post('/api/update/publication/:id', publication.update_publication);

    app.post('/api/text/post/text', publication.post_text_content);
    app.post('/api/text/update/:id', publication.update_text_content);

    /*
     *
     *  API: Container (Exhibition + publication)
     *
     */

    app.delete('/api/container/:id', container.delete);

    /*
     *
     *  FRONTEND
     *
     */

    app.get('/infra', auth.isLoggedIn, frontend.infra);
    app.get('/', frontend.index);

    app.get('*', frontend.fallback);

  };