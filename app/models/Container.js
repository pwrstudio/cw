/*
 *
 *  Container (exhibition + publication)
 *
 */

var mongoose = require('mongoose');

var containerSchema = new mongoose.Schema({
  title: String,
  location: String,
  start_date: Date,
  end_date: Date,
  start_date_pretty: String,
  end_date_pretty: String,
  link: String,
  publisher: String,
  specs: String,
  solo: Boolean,
  group: Boolean,
  index: Number,
  text: [{
    url: String,
    size: Number,
    caption: String
  }],
  image: [{
    url: String,
    thumb: String,
    small: String,
    large: String,
    size: Number,
    caption: String
  }],
  sound: [{
    url: String,
    size: Number,
    caption: String
  }]
});

module.exports = mongoose.model('container', containerSchema);