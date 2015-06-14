var formidable = require('formidable');

var Publication = require('../models/Publication.js');
var Content = require('../models/Content.js');

exports.get_publication = function (req, res) {

  Publication.find().sort({
    title: 1
  }).exec(function (err, publications) {
    if (err)
      res.send(err);

    res.json(publications);
  });
};

exports.post_publication = function (req, res) {

  var form = new formidable.IncomingForm();

  form.on('field', function (field, value) {

    var publication = new Publication();
    publication.title = value;

    publication.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.json('{"success"}');
      }
    });

  });

  form.parse(req);

};

exports.add_publication_to_post = function (req, res) {

  Content.findById(req.params.image_id, function (err, image) {
    if (err) {
      res.send(err);
    }
    Publication.findById(req.params.publication_id, function (err, publication) {
      if (err) {
        res.send(err);
      }
      image.publications.push(publication._id);
      image.save(function (err) {
        if (err) {
          res.send(err);
        }
      });
    });
    res.json(image);
  });
};

exports.get_publication_image = function (req, res) {
  Content.findById(req.params.id, function (err, image) {
    if (err) {
      res.send(err);
    } else {
      res.json(image.publications);
    }
  });
};