// grab the mongoose module
var mongoose = require('mongoose');

var containerSchema = new mongoose.Schema({
  title: String,
  location: String,
  start_date: Date,
  end_date: Date,
  publisher: String
});

module.exports = mongoose.model('container', containerSchema);