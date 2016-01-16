/*
 *
 *  Publication handler
 *
 */

(function () {

  "use strict";

  var formidable = require('formidable'),
    Container = require('../models/Container.js'),
    rimraf = require('rimraf'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    validator = require('validator'),
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

  function pushImage(image, caption, now) {

    console.log(image)
    console.log(caption);

    var dir = fullDir + '/' + now,
      fullPath = '/data/' + now + '/' + image.name,
      newPath = dir + '/' + image.name,
      stats,
      fileSizeInKilobytes;


    fs.renameSync(image.path, newPath);

    resizeContent(newPath, dir, image.name);

    stats = fs.statSync(newPath);
    fileSizeInKilobytes = stats.size / 1000.0;

    return ({
      size: fileSizeInKilobytes,
      url: fullPath,
      caption: caption,
      thumb: '/data/' + now + '/' + 'thumbnail-' + image.name,
      large: '/data/' + now + '/' + 'large-' + image.name,
      small: '/data/' + now + '/' + 'small-' + image.name
    });

  }

  function pushSound(sound, caption, now) {

    console.log(sound);
    console.log(caption);

    var dir = fullDir + '/' + now,
      fullPath = '/data/' + now + '/' + sound.name,
      newPath = dir + '/' + sound.name,
      stats,
      fileSizeInKilobytes;

    fs.renameSync(sound.path, newPath);

    resizeContent(newPath, dir, sound.name);

    stats = fs.statSync(newPath);
    fileSizeInKilobytes = stats.size / 1000.0;

    return ({
      size: fileSizeInKilobytes,
      url: fullPath,
      caption: caption
    });

  }

  function pushText(text, caption, now) {

    console.log(text);
    console.log(caption);

    var dir = fullDir + '/' + now,
      fullPath = '/data/' + now + '/' + text.name,
      newPath = dir + '/' + text.name,
      stats,
      fileSizeInKilobytes;

    fs.renameSync(text.path, newPath);

    resizeContent(newPath, dir, text.name);

    stats = fs.statSync(newPath);
    fileSizeInKilobytes = stats.size / 1000.0;

    return ({
      size: fileSizeInKilobytes,
      url: fullPath,
      caption: caption
    });

  }

  /*
   *
   *  Initialize data directory
   *
   */

  const dataDir = '/public/data',
    fullDir = appRoot + dataDir;

  fs.existsSync(fullDir) || fs.mkdirSync(fullDir);

  /*
   *
   *  Get all publication
   *
   */

  exports.get_publication = function (req, res) {
    Container.find().sort({
      index: 1
    }).exec(function (err, publications) {
      res.json(publications);
    });
  };

  /*
   *
   *  Add publication
   *
   */

  exports.post_publication = function (req, res) {

    var form = new formidable.IncomingForm(),
      now = Date.now(),
      dir = fullDir + '/' + now;

    fs.mkdirSync(dir);

    form.parse(req, function (err, fields, files) {

      var publication = new Container();

      publication.title = fields.title;
      publication.link = fields.link;
      publication.start_date = fields.start_date;
      publication.start_date_pretty = fields.start_date;
      publication.publisher = fields.publisher || 'self-published';


      console.log(files);
      console.log(files.snd1);

      // Images

      if (files.img1.size > 0) {
        publication.image.push(pushImage(files.img1, fields.imgcap1, now));
        if (files.img2.size > 0) {
          publication.image.push(pushImage(files.img2, fields.imgcap2, now));
          if (files.img3.size > 0) {
            publication.image.push(pushImage(files.img3, fields.imgcap3, now));
            if (files.img4.size > 0) {
              publication.image.push(pushImage(files.img4, fields.imgcap4, now));
              if (files.img5.size > 0) {
                publication.image.push(pushImage(files.img5, fields.imgcap5, now));
                if (files.img6.size > 0) {
                  publication.image.push(pushImage(files.img6, fields.imgcap6, now));
                  if (files.img7.size > 0) {
                    publication.image.push(pushImage(files.img7, fields.imgcap7, now));
                    if (files.img8.size > 0) {
                      publication.image.push(pushImage(files.img8, fields.imgcap8, now));
                      if (files.img9.size > 0) {
                        publication.image.push(pushImage(files.img9, fields.imgcap9, now));
                        if (files.img10.size > 0) {
                          publication.image.push(pushImage(files.img10, fields.imgcap10, now));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Sounds

      if (files.snd1.size > 0) {
        publication.sound.push(pushSound(files.snd1, fields.sndcap1, now));
        if (files.snd2.size > 0) {
          publication.sound.push(pushSound(files.snd2, fields.sndcap2, now));
          if (files.snd3.size > 0) {
            publication.sound.push(pushSound(files.snd3, fields.sndcap3, now));
            if (files.snd4.size > 0) {
              publication.sound.push(pushSound(files.snd4, fields.sndcap4, now));
              if (files.snd5.size > 0) {
                publication.sound.push(pushSound(files.snd5, fields.sndcap5, now));
                if (files.snd6.size > 0) {
                  publication.sound.push(pushSound(files.snd6, fields.sndcap6, now));
                  if (files.snd7.size > 0) {
                    publication.sound.push(pushSound(files.snd7, fields.sndcap7, now));
                    if (files.snd8.size > 0) {
                      publication.sound.push(pushSound(files.snd8, fields.sndcap8, now));
                      if (files.snd9.size > 0) {
                        publication.sound.push(pushSound(files.snd9, fields.sndcap9, now));
                        if (files.snd10.size > 0) {
                          publication.sound.push(pushSound(files.snd10, fields.sndcap10, now));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Texts

      if (files.text1.size > 0) {
        publication.text.push(pushText(files.text1, fields.textcap1, now));
        if (files.text2.size > 0) {
          publication.text.push(pushText(files.text2, fields.textcap2, now));
          if (files.text3.size > 0) {
            publication.text.push(pushText(files.text3, fields.textcap3, now));
            if (files.text4.size > 0) {
              publication.text.push(pushText(files.text4, fields.textcap4, now));
              if (files.text5.size > 0) {
                publication.text.push(pushText(files.text5, fields.textcap5, now));
                if (files.text6.size > 0) {
                  publication.text.push(pushText(files.text6, fields.textcap6, now));
                  if (files.text7.size > 0) {
                    publication.text.push(pushText(files.text7, fields.textcap7, now));
                    if (files.text8.size > 0) {
                      publication.text.push(pushText(files.text8, fields.textcap8, now));
                      if (files.text9.size > 0) {
                        publication.text.push(pushText(files.text9, fields.textcap9, now));
                        if (files.text10.size > 0) {
                          publication.text.push(pushText(files.text10, fields.textcap10, now));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      console.log(publication);

      publication.save(function (err) {
        res.json({
          result: 'publication'
        });
      });

    });

  };

  /*
   *
   *  Update publication
   *
   */

  exports.update_publication = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

      Container.findById(req.params.id, function (err, publication) {

        if (publication) {

          publication.title = fields.title;
          publication.link = fields.link;
          publication.publisher = fields.publisher || 'self-published';
          publication.start_date = fields.start_date;
          publication.start_date_pretty = fields.start_date;

          publication.save(function (err) {
            res.json({
              result: 'publication'
            });
          });

        }
      });

    });

  };

  /*
   *
   *  Update content order
   *
   */

  exports.update_order = function (req, res) {

    Container.findById(req.params.id, function (err, container) {

      if (container) {

        container.index = req.params.index;

        container.save(function (err) {
          res.json({
            result: 'container'
          });
        });

      }
    });

  };


}());