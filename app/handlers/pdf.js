/*
 *
 *  PDF generation handler
 *
 */

var phantom = require('phantom'),
  Collection = require('../models/Collection.js'),
  Content = require('../models/Content.js'),
  slug = require('slug');

/*
 *
 *  Generate pdf from collection
 *
 */

exports.generatePdf = function (req, res) {

  console.log(req.params.slug);

  // Find collection by slug
  Collection.findOne({
    slug: req.params.slug
  }).exec(function (err, collection) {

    if (collection != undefined && collection != null) {

      phantom.create(function (ph) {
        ph.createPage(function (page) {
          page.open("http://ec2-52-5-9-41.compute-1.amazonaws.com/collection/" + collection.slug, function (status) {
            console.log("opened? ", status);
            page.set('paperSize', {
              format: 'A4',
              orientation: 'landscape'
            }, function () {
              page.render('./public/file.pdf', function () {
                var filenamn = collection.slug + "_" + slug(new Date()) + "_canell-watkins.pdf";
                  res.download('./public/file.pdf', filenamn);
                ph.exit();
              });
            });
          });
        });
      });

    } else {
      res.end("fail");
    }

  });

};