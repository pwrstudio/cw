/*
 *
 *  Container handler
 *
 */

var formidable = require('formidable'),
  Container = require('../models/Container.js');


/*
 *
 *  Delete Container
 *
 */

exports.delete = function (req, res) {

  Container.remove({
    _id: req.params.id
  }, function (err, content) {
    if (err) {
      res.send(err);
    }
    res.json({
      message: 'Success'
    });
  });
};