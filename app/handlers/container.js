/*
 *
 *  Container handler
 *
 */

(function () {

  "use strict";

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
      res.json({
        message: 'Success'
      });
    });

  };

}());