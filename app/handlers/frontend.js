/*jslint browser: true, devel: true, node: true, nomen: true, plusplus: true*/

/*
 *
 *  FRONTEND HANDLER
 *
 */

(function () {

  "use strict";

  var geoip = require('geoip-lite'),
    geopoint = require('geopoint'),
    SolarCalc = require('solar-calc'),
    Container = require('../models/Container.js'),
    Content = require('../models/Content.js'),
    Collection = require('../models/Collection.js'),
    async = require('async');

  /*
   *
   *  Render index page
   *
   */

  exports.index = function (req, res) {

    var serverGeo = geoip.lookup("85.214.100.3"),
      now = new Date(),
      night = false,
      solar,
      lat,
      long;

    if (serverGeo) {

      lat = serverGeo.ll[0];
      long = serverGeo.ll[1];
      now = new Date();
      night = false;
      solar = new SolarCalc(now, lat, long);

      if (now > solar.sunset) {
        night = true;
      } else if (now.getHours() >= 0 && now.getHours() <= solar.sunrise.getHours()) {
        night = true;
      }

      // Find publications
      Container.find({
        publisher: {
          $exists: true
        }
      }).sort({
        index: 1
      }).exec(function (err, publications) {
        
        console.log(publications);

        // Find exhibitions
        Container.find({
          location: {
            $exists: true
          }
        }).sort({
          start_date: -1
        }).exec(function (err, exhibitions) {

          // Find works
          Content.find().sort({
            index: 1
          }).exec(function (err, data_content) {

            var ctx = {},
              frontpage = {};

            // Find VIDEO frontpage
            Content.findOne({
              "video.frontpage": true
            }).exec(function (err, videoFrontpage) {

              if (videoFrontpage) {

                ctx = {
                  night: night,
                  frontpage: {
                    video: videoFrontpage.video.url
                  },
                  publications: publications,
                  exhibitions: exhibitions,
                  content: data_content
                };

                console.log(ctx.publications);

                console.log("VIDEO");

                res.render('index', {
                  data: ctx,
                  helpers: {
                    replacenewlines: function (caption) {
                      var out = caption.replace(new RegExp('\n', 'g'), '<br>');
                      console.log(out);
                      return out;
                    }
                  }
                });

                return;

              } else {

                // Find AUDIO frontpage
                Content.findOne({
                  "audio.frontpage": true
                }).exec(function (err, audioFrontpage) {

                  if (audioFrontpage) {

                    ctx = {
                      night: night,
                      frontpage: {
                        audio: audioFrontpage.audio.url
                      },
                      publications: publications,
                      exhibitions: exhibitions,
                      content: data_content
                    };

                    console.log("AUDIO");

                    res.render('index', {
                      data: ctx,
                      helpers: {
                        replacenewlines: function (caption) {
                          var out = caption.replace(new RegExp('\n', 'g'), '<br>');
                          console.log(out);
                          return out;
                        }
                      }
                    });

                    return;

                  } else {

                    // Find IMAGE frontpage
                    Content.findOne({
                      "image.frontpage": true
                    }).exec(function (err, imageFrontpage) {

                      if (imageFrontpage) {

                        ctx = {
                          night: night,
                          frontpage: {
                            image: imageFrontpage.image.url,
                            pinky: imageFrontpage.image.pinky,
                          },
                          publications: publications,
                          exhibitions: exhibitions,
                          content: data_content
                        };

                        console.log("IMAGE");

                        res.render('index', {
                          data: ctx,
                          helpers: {
                            replacenewlines: function (caption) {
                              var out = caption.replace(new RegExp('\n', 'g'), '<br>');
                              console.log(out);
                              return out;
                            }
                          }
                        });

                        return;

                      } else {

                        ctx = {
                          frontpage: {
                            empty: true
                          },
                          night: night,
                          publications: publications,
                          exhibitions: exhibitions,
                          content: data_content
                        };

                        console.log("EMPTY FRONTPAGE");

                        res.render('index', {
                          data: ctx,
                          helpers: {
                            replacenewlines: function (caption) {
                              var out = caption.replace(new RegExp('\n', 'g'), '<br>');
                              console.log(out);
                              return out;
                            }
                          }
                        });

                        return;

                      }

                    });

                  }

                });
              }
            });
          });
        });
      });
    }
  };


  /*
   *
   *  Render backend area
   *
   */

  exports.infra = function (req, res) {
    res.render('infra', {
      layout: "backend"
    });
  };


  /*
   *
   *  Render collection page
   *
   */

  exports.collection = function (req, res) {

    // Find collection by slug
    Collection.findOne({
      slug: req.params.slug
    }).exec(function (err, collection) {

      res.render('collection', collection);

    });
  };

  /*
   *
   *  Render collections area
   *
   */

  exports.collectioninfra = function (req, res) {
    res.render('collectioninfra', {
      layout: "backend"
    });
  };

  /*
   *
   *  Render collection for pdf generation
   *
   */

  exports.renderPdf = function (req, res) {

    // Find collection by slug
    Collection.findOne({
      slug: req.params.slug
    }).exec(function (err, collection) {

      res.render('pdf', {
        data: collection,
        layout: 'pdfback'
      });

    });

  };


  /*
   *
   *  Fallback 404
   *
   */

  exports.fallback = function (req, res) {
    res.render('404', {});
  };

}());
