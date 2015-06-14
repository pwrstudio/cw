// grab the mongoose module
var mongoose = require('mongoose');
var random = require('mongoose-random');

var publicationSchema = new mongoose.Schema({
  title: String,
  publisher: String,
  date: Date,
  tags: [String]
});

module.exports = mongoose.model('cw_Publication', publicationSchema);