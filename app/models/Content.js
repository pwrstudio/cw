/*
 *
 *  Content (image / text)
 *
 */

var mongoose = require('mongoose');
var random = require('mongoose-random');

var contentSchema = new mongoose.Schema({
  title: String,
  text: {
    author: String,
    file: String,
  },
  image: {
    caption: String,
    credits: String,
    url: String,
    thumb: String,
    pinky: String,
    small: String,
    large: String,
    size: Number,
    frontpage: Boolean
  },
  audio: {
    caption: String,
    credits: String,
    file: String,
    size: Number,
    frontpage: Boolean
  },
  video: {
    caption: String,
    credits: String,
    file: String,
    size: Number,
    frontpage: Boolean
  },
  date: Date,
  year: Number,
  user: String,
  public: Boolean,
  tags: [String]
});

module.exports = mongoose.model('content', contentSchema);
