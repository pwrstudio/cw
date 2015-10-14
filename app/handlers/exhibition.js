/*
 *
 *  Exhibition handler
 *
 */

var formidable = require('formidable'),
    Container = require('../models/Container.js');

/*
 *
 *  Get all exhibitions
 *
 */

exports.get_exhibition = function (req, res) {
    Container.find().sort({
        start_date: -1
    }).exec(function (err, exhibitions) {
        if (err) {
            res.send(err);
        }
        res.json(exhibitions);
    });
};


/*
 *
 *  Add exhibition
 *
 */

exports.post_exhibition = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

        console.log(fields);

        var exhibition = new Container();
        exhibition.title = fields.title;
        exhibition.location = fields.location;
        exhibition.link = fields.link;
        exhibition.start_date = fields.start_date;
        exhibition.end_date = fields.end_date;
        exhibition.start_date_pretty = fields.start_date;
        exhibition.end_date_pretty = fields.end_date;
        if (fields.radios == "solo") {
            exhibition.solo = true;
        }
        if (fields.radios == "group") {
            exhibition.group = true;
        }

        exhibition.save(function (err) {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    result: "exhibition"
                });
            }
        });

    });

};


/*
 *
 *  Update exhibition
 *
 */

exports.update_exhibition = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

        console.log(fields);

        Container.findById(req.params.id, function (err, exhibition) {
            if (err) {
                res.send(err);
            }

            exhibition.title = fields.title;
            exhibition.location = fields.location;
            exhibition.link = fields.link;
            exhibition.start_date = fields.start_date;
            exhibition.end_date = fields.end_date;
            exhibition.start_date_pretty = fields.start_date;
            exhibition.end_date_pretty = fields.end_date;
            if (fields.radios == "solo") {
                exhibition.solo = true;
            }
            if (fields.radios == "group") {
                exhibition.group = true;
            }

            exhibition.save(function (err) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        result: "exhibition"
                    });
                }
            });

        });

    });

};
