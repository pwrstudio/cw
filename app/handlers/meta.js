/*
 *
 *  Meta handler
 *
 */

var Meta = require('../models/Meta.js'),
    formidable = require('formidable');

/*
 *
 *  Get meta
 *
 */

exports.get_meta = function (req, res) {
    Meta.findOne().exec(function (err, meta) {
        if (err) {
            res.send(err);
        }
        res.json(meta);
    });
};


/*
 *
 *  Set meta
 *
 */

exports.set_meta = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

        Meta.findOne("", function (err, meta) {
            if (err) {
                res.send(err);
            }

            meta.title = fields.title;
            meta.description = fields.description;
            meta.email = fields.email;

            meta.save(function (err) {
                res.json({
                    result: 'meta'
                });
            });
        });

    });

}