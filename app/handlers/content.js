/*
 *
 *  CONTENT HANDLER
 *
 */

var formidable = require('formidable'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    easyimg = require('easyimage'),
    Content = require('../models/Content.js'),
    easyimg = require('easyimage');

function resizeContent(newPath, dir, fileName) {

    // Thumbnail
    easyimg.resize({
        src: newPath,
        dst: dir + '/' + "thumbnail-" + fileName,
        width: 300,
        height: 300,
        quality: 70,
    });

    // Pinkynail
    easyimg.resize({
        src: newPath,
        dst: dir + '/' + "pinkynail-" + fileName,
        width: 64,
        height: 64,
        quality: 20,
    });

    // Large
    easyimg.resize({
        src: newPath,
        dst: dir + '/' + "large-" + fileName,
        width: 800,
        height: 800,
        quality: 80,
    });

    // Small
    easyimg.resize({
        src: newPath,
        dst: dir + '/' + "small-" + fileName,
        width: 450,
        height: 450,
        quality: 80,
    });
}


/*
 *
 *  Initialize data directory
 *
 */

var dataDir = '/public/data',
    fullDir = appRoot + dataDir;

fs.existsSync(fullDir) || fs.mkdirSync(fullDir);



/*
 *
 *  Get all content
 *
 */

exports.get_content = function (req, res) {
    Content.find().sort({
        date: -1
    }).exec(function (err, contents) {
        res.json(contents);
    });
};


/*
 *
 *  Get content by ID
 *
 */

exports.get_content_by_id = function (req, res) {
    Content.findById(req.params.id, function (err, content) {
        res.json(content);
    });
};

/*
 *
 *  Add image
 *
 */

exports.post_image_content = function (req, res) {

    var form = new formidable.IncomingForm(),
        now = Date.now(),
        dir = fullDir + '/' + now;

    fs.mkdirSync(dir);

    form.parse(req, function (err, fields, files) {

        var fullFilePath = '/data/' + now + '/' + files.pic.name;

        var newPath = dir + '/' + files.pic.name;

        fs.renameSync(files.pic.path, newPath);

        resizeContent(newPath, dir, files.pic.name);

        var stats = fs.statSync(newPath);
        var fileSizeInKilobytes = stats.size / 1000.0;

        var content = new Content();
        content.date = new Date();
        content.year = fields.year;
        content.public = fields.public;
        content.image.frontpage = fields.frontpage;
        content.image.size = fileSizeInKilobytes;
        content.image.url = fullFilePath;
        content.image.thumb = '/data/' + now + '/' + "thumbnail-" + files.pic.name;
        content.image.large = '/data/' + now + '/' + "large-" + files.pic.name;
        content.image.small = '/data/' + now + '/' + "small-" + files.pic.name;
        content.image.pinky = '/data/' + now + '/' + "pinkynail-" + files.pic.name;
        content.title = fields.title;
        content.image.caption = fields.caption;

        content.save(function (err) {
            res.json({
                result: 'content'
            });
        });
    });
};


/*
 *
 *  Update image
 *
 */

exports.update_image_content = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {

        Content.findById(req.params.id, function (err, content) {

            if (content != null && content != undefined) {

                content.year = fields.year;
                content.public = fields.public;
                content.image.frontpage = fields.frontpage;
                content.title = fields.title;
                content.image.caption = fields.caption;

                content.save(function (err) {
                    res.json({
                        result: 'content'
                    });
                });

            }
        });

    });
};


/*
 *
 *  Add text post
 *
 */

exports.post_text_content = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {

        var content = new Content();
        content.public = fields.public;
        content.date = new Date();
        content.year = fields.year;
        content.text.body = fields.text;
        content.title = fields.title;
        content.text.author = fields.author;
        content.text.link = fields.link;
        content.user = req.user.email;

        content.save(function (err) {
            res.json({
                result: 'content'
            });
        });

    });

};


/*
 *
 *  Update text post
 *
 */

exports.update_text_content = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {

        Content.findById(req.params.id, function (err, content) {

            if (content != null && content != undefined) {

                content.public = fields.public;
                content.year = fields.year;
                content.text.body = fields.text;
                content.title = fields.title;
                content.text.author = fields.author;
                content.text.link = fields.link;
                content.user = req.user.email;

                content.save(function (err) {
                    res.json({
                        result: 'content'
                    });
                });
            }
        });

    });

};


/*
 *
 *  Delete image
 *
 */

exports.delete_image_content = function (req, res) {
    Content.findById(req.params.id, function (err, content) {
        if (content != null && content != undefined) {
            var p = content.image.url.split('/');
            rimraf(fullDir + '/' + p[2], function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });

    Content.remove({
        _id: req.params.id
    }, function (err, content) {
        res.json({
            message: 'Success'
        });
    });
};


/*
 *
 *  Delete text
 *
 */

exports.delete_text_content = function (req, res) {
    Content.remove({
        _id: req.params.id
    }, function (err, content) {
        res.json({
            message: 'Success'
        });
    });
};
