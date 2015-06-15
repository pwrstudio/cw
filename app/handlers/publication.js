var formidable = require('formidable');
var Container = require('../models/Container.js');
var Content = require('../models/Content.js');

exports.get_publication = function (req, res) {

  Container.find().sort({
    start_date: -1
  }).exec(function (err, publications) {
    if (err)
      res.send(err);

    res.json(publications);
  });
};

exports.post_publication = function (req, res) {

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    console.log(fields);

    var publication = new Container();
    publication.title = fields.title;
    publication.link = fields.link;
    publication.publisher = fields.publisher;
    publication.start_date = fields.start_date;
    publication.start_date_pretty = fields.start_date;

    publication.save(function (err) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          result: 'publication'
        });
      }
    });

  });

};