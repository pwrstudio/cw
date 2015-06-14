// grab the mongoose module
var mongoose = require('mongoose');
var random = require('mongoose-random');

var exhibitionSchema = new mongoose.Schema({
  title: String,
  location: String,
  start_date: Date,
  end_date: Date,
  tags: [String]
});

module.exports = mongoose.model('cw_Exhibition', exhibitionSchema);